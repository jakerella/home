
var fs = require('fs'),
    path = require('path'),
    q = require('q'),
    _ = require('lodash');

module.exports = function(site) {
    
    // ------------------ Public Methods ------------------ //
    var methods = {
        getContent: function (options) {
            var def = q.defer();

            options = _.extend({
                includeStatic: false,
                sortByTime: null,
                limit: 0,
                includeBrief: true
            }, options);

            fs.readdir(options.dir, function(err, files) {
                if (err) { def.reject(err); return; }

                getAllFiles(files, options)
                    .then(function(fileList) {
                        return filterFiles(fileList, options);
                    })
                    .then(function(fileList) {
                        return sortFiles(fileList, options);
                    })
                    .then(function(fileList) {
                        return pageFiles(fileList, options);
                    })
                    .then(function(fileList) {
                        return getFileData(fileList, options);
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
                        time: stat.mtime.getTime()
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

        if (options.sortByTime) {
            fileList.sort(function(a, b) {
                if (options.sortByTime === 'DESC') {
                    return b.time - a.time;
                } else {
                    return a.time - b.time;
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
                fileReads.push(getContentBrief(file, options));
            });

            q.allSettled(fileReads)
                .then(function(results) {
                    results.forEach(function(result, i) {
                        if (result.state === 'fulfilled') {
                            fileList[i] = result.value;
                        } else {
                            console.error('Unable to read file contents: ', result.reason);
                            fileList[i].brief = '[Sorry, that content is not available]';
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

    function getContentBrief(file, options) {
        var length = options.length || site.briefWordCount || 100,
            def = q.defer();

        fs.readFile(
            path.join(options.dir, file.slug + '.md'),
            { encoding: 'utf-8' },
            function(err, content) {
                if (err) { def.reject(err); }

                file.brief = content.substr(0, length);
                def.resolve(file);
            }
        );

        return def.promise;
    }

    function getContentWords() {
        
    }

    return methods;
};
