var fs = require('fs'),
    path = require('path'),
    q = require('q'),
    _ = require('lodash');

module.exports = function(site) {

    // --------------- Public API methods --------------------- //
    return {
    
        getAllContent: function(req, res) {
            getContent({
                dir: site.contentDir,
                includeStatic: true,
                limit: 0
            })
                .then(function(fileList) {
                    res.json(fileList);
                })
                .fail(function(err) {
                    console.log('API ERROR (getAllContent): ' + err);
                    res.status(500).send('Unable to complete request');
                });
        },

        getAllPosts: function(req, res) {
            getContent({
                dir: site.contentDir,
                includeStatic: false,
                limit: 0
            })
                .then(function(fileList) {
                    res.json(fileList);
                })
                .fail(function(err) {
                    console.log('API ERROR (getAllPosts): ' + err);
                    res.status(500).send('Unable to complete request');
                });
        },

        getRecentPosts: function(req, res) {
            getContent({
                dir: site.contentDir,
                includeStatic: false,
                limit: site.pageSearchLimit || 5,
                sortByTime: 'DESC'
            })
                .then(function(fileList) {
                    res.json(fileList);
                })
                .fail(function(err) {
                    console.log('API ERROR (getRecentPosts): ' + err);
                    res.status(500).send('Unable to complete request');
                });
        }

    };


    // ------------ Private Helpers, Site-Specific ------------ //

    function getContent(options) {
        var def = q.defer();

        options = _.extend({
            includeStatic: false,
            sortByTime: null,
            limit: 0
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
                .then(def.resolve)
                .fail(def.reject);
        });

        return def.promise;
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

};