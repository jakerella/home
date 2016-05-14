
var fs = require('fs'),
    path = require('path'),
    q = require('q'),
    _ = require('lodash'),
    marked = require('marked'),

    WORD_COUNT = 100,
    CACHE_FILE = path.join(__dirname, '..', 'tmp', 'contentcache.json'),
    EXPIRE_TIME = (30 * 24 * 60 * 60 * 1000);

module.exports = function(site) {

    // ------------------ Public Methods ------------------ //
    var methods = {
        getContent: function (options) {
            var def = q.defer();

            options = _.extend({
                includeStatic: false,
                sortByTime: null,
                sortByModTime: null,
                limit: 0,
                briefWordCount: site.briefWordCount,
                briefIncludeTitles: !!site.briefIncludeTitles,
                skip: 0
            }, options);

            fs.readdir(options.dir, function(err, files) {
                if (err) { def.reject(err); return; }

                getAllFiles(files, options)
                    .then(function(fileList) {
                        return filterFiles(fileList, options);
                    })
                    // wow... this is inefficient, we have to read every file
                    // before we can sort or page... maybe we can cache this info?
                    .then(function(fileList) {
                        return getFileData(fileList, options);
                    })
                    .then(function(fileList) {
                        return sortFiles(fileList, options);
                    })
                    .then(function(fileList) {
                        return pageFiles(fileList, options);
                    })
                    .then(def.resolve)
                    .fail(def.reject);
            });

            return def.promise;
        },

        getTags: function() {
            var cache = getCache(),
                tags = {},
                posts = Object.keys(cache);

            posts.forEach(function(post) {
                cache[post].tags.forEach(function(tag) {
                    if (!tags[tag.trim()]) {
                        tags[tag.trim()] = [];
                    }
                    tags[tag.trim()].push({
                        slug: cache[post].slug,
                        publishTime: cache[post].publishTime,
                        tags: cache[post].tags
                    });
                });
            });

            return tags;
        }
    };


    // ------------------ Private Helpers ------------------- //

    function getCache() {
        var cache = {};

        try {
            // first we clear out the content cache file from require's own cache
            // otherwise cache updates won't be detected by any other request
            require.cache[CACHE_FILE] = null;
            cache = require(CACHE_FILE);
        } catch(err) {
            // ignore me! The default (empty) value will be used
        }
        return cache;
    }

    function getAllFiles(fileList, options) {
        var def = q.defer();

        fileList = fileList
            .map(function(fname) {
                var slug = fname.replace(/\..+/, ''),
                    stat = fs.statSync(path.join(options.dir, fname));

                if (stat.isFile()) {
                    return {
                        slug: slug,
                        modtime: stat.mtime.getTime()
                    };
                }
            })
            .filter(function(file) {
                return !!file;
            });

        def.resolve(fileList);
        return def.promise;
    }

    function filterFiles(fileList, options) {
        var def = q.defer();

        if (!options.includeStatic) {
            fileList = fileList.filter(function(file) {
                return !(site.pageData[file.slug] && site.pageData[file.slug].isStatic);
            });
        }

        def.resolve(fileList);
        return def.promise;
    }

    function sortFiles(fileList, options) {
        var def = q.defer();

        if (options.sortByModTime) {
            fileList.sort(function(a, b) {
                if (options.sortByModTime === 'DESC') {
                    return b.modtime - a.modtime;
                } else {
                    return a.modtime - b.modtime;
                }
            });
        }

        if (options.sortByTime) {
            fileList.sort(function(a, b) {
                if (options.sortByTime === 'DESC') {
                    return b.publishTime - a.publishTime;
                } else {
                    return a.publishTime - b.publishTime;
                }
            });
        }

        def.resolve(fileList);
        return def.promise;
    }

    function pageFiles(fileList, options) {
        var def = q.defer(),
            start = options.skip || 0,
            stop = (options.limit && (options.limit + options.skip)) || 9999,
            hasMore = (fileList.length - start) > options.limit;

        fileList = fileList.slice(start, stop);

        def.resolve({
            files: fileList,
            hasPrevPage: (start > 0),
            hasNextPage: hasMore,
            prevSkip: (start > 0) && Math.max(0, (start - options.limit)),
            nextSkip: hasMore && (start + options.limit)
        });
        return def.promise;
    }

    function getFileData(fileList, options) {
        var cache = getCache(),
            fileReads = [],
            data = [],
            now = (new Date()).getTime(),
            def = q.defer();

        fileList.forEach(function(file) {
            if (cache[file.slug] && cache[file.slug].expires > now) {
                file.brief = cache[file.slug].brief || '';
                file.tags = cache[file.slug].tags || [];
                file.publishTime = cache[file.slug].publishTime || null;
                data.push(file);
            } else {
                fileReads.push(getContentData(file, options));
            }
        });

        q.allSettled(fileReads)
            .then(function(results) {
                results.forEach(function(result) {
                    if (result.state === 'fulfilled') {
                        data.push(result.value);
                        setCacheForFile(cache, result.value);
                    } else {
                        console.error('Unable to read file contents: ', result.reason);
                    }
                });

                // We'll initiate the cache writing here, but we will not wait
                // to resolve the parent action. If cache writing fails, we'll
                // just build it again on the next request
                if (results.length) {
                    writeNewCacheFile(cache);
                }

                def.resolve(data);
            });

        return def.promise;
    }

    function setCacheForFile(cache, file) {
        cache[file.slug] = {
            slug: file.slug,
            brief: file.brief || '',
            tags: file.tags || [],
            publishTime: file.publishTime || null,
            expires: (new Date()).getTime() + EXPIRE_TIME
        };
    }

    function writeNewCacheFile(cache) {
        var def = q.defer();

        fs.writeFile(
            CACHE_FILE,
            JSON.stringify(cache),
            { encoding: 'utf-8', mode: 420 },
            function(err) {
                if (err) {
                    console.error('Error writing to cache (' + CACHE_FILE + '):', err.stack);
                    def.reject(err);
                }
                def.resolve(CACHE_FILE);
            }
        );

        return def.promise;
    }

    function getContentData(file, options) {
        var def = q.defer();

        fs.readFile(
            path.join(options.dir, file.slug + '.md'),
            { encoding: 'utf-8' },
            function(err, content) {
                if (err) { def.reject(err); }

                file.brief = getContentWords(content, options);
                file.tags = getContentTags(content);
                file.publishTime = getContentPublishTime(content);

                def.resolve(file);
            }
        );

        return def.promise;
    }

    function getContentWords(content, options) {
        var re, briefContent,
            brief = content,
            length = options.briefWordCount || WORD_COUNT;

        if (!options.briefIncludeTitles) {
            brief = brief.replace(/^\#+\s+.+\n/gm, '');
        }

        re = new RegExp('[^a-z]*([\\w]+[^\\w]+){' + length + '}', 'i');
        brief = brief.match(re);
        briefContent = (brief && brief[0] && marked(brief[0] + '...')) || '';

        return briefContent;
    }

    function getContentTags(content) {
        var tags = [],
            m = /@@\s([\w\s]+(?:,\s*[\w\s]+)*)/g.exec(content);

        if (m) {
            tags = m[1].replace(/\n/, '').split(/\s*\,\s*/);
        }

        return tags;
    }

    function getContentPublishTime(content) {
        var d,
            publishTime = null,
            m = /^\{{2}\s*([^\}]+)\s*\}{2}$/mg.exec(content);

        if (m) {
            d = (new Date(m[1]));
            publishTime = d.getTime() || m[1];
        }

        return publishTime;
    }

    return methods;
};
