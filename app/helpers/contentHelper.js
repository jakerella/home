
var fs = require('fs'),
    path = require('path'),
    q = require('q'),
    _ = require('lodash'),
    marked = require('marked');

module.exports = function(site) {
    var WORD_COUNT = 100;

    // ------------------ Public Methods ------------------ //
    var methods = {
        getContent: function (options) {
            var def = q.defer();

            options = _.extend({
                includeStatic: false,
                sortByTime: null,
                sortByModTime: null,
                limit: 0,
                includeBrief: true,
                briefWordCount: site.briefWordCount,
                briefIncludeTitles: !!site.briefIncludeTitles,
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
        }
    };


    // ------------------ Private Helpers ------------------- //

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
        var def = q.defer();

        if (options.limit) {
            fileList = fileList.slice(0, options.limit);
        }

        def.resolve(fileList);
        return def.promise;
    }

    function getFileData(fileList, options) {
        var fileReads = [],
            def = q.defer();

        if (options.includeBrief) {

            fileList.forEach(function(file) {
                fileReads.push(getContentData(file, options));
            });

            q.allSettled(fileReads)
                .then(function(results) {
                    results.forEach(function(result, i) {
                        if (result.state === 'fulfilled') {
                            fileList[i] = result.value;
                        } else {
                            console.error('Unable to read file contents: ', result.reason);
                            fileList[i].brief = '[Sorry, that content is not available]';
                            fileList[i].tags = [];
                            fileList[i].publishTime = null;
                        }
                    });

                    def.resolve(fileList);
                });

        } else {
            // No briefs requested
            def.resolve(fileList);
        }

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
        var re,
            brief = content,
            length = options.briefWordCount || WORD_COUNT;

        if (!options.briefIncludeTitles) {
            brief = brief.replace(/^\#+\s+.+\n/gm, '');
        }

        re = new RegExp('[^a-z]*([\\w]+[^\\w]+){' + length + '}', 'i');
        brief = brief.match(re);

        return marked(brief[0] + '...');
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
            m = /\{{2}\s*([^\}]+)\s*\}{2}/g.exec(content);

        if (m) {
            d = (new Date(m[1]));
            publishTime = d.getTime() || m[1];
        }

        return publishTime;
    }

    return methods;
};
