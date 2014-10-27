var fs = require('fs'),
    path = require('path'),
    q = require('q'),
    _ = require('lodash');

module.exports = function(site) {

    // ------------ Private Helpers, Site-Specific ------------ //

    function getContent(options) {
        var dir,
            def = q.defer();

        options = _.extend({
            includeStatic: false,
            sortByTime: null,
            limit: 0
        }, options);

        dir = options.dir;

        fs.readdir(dir, function(err, files) {
            if (err) { def.reject(err); return; }

            var fileList = files
                .map(function(fname) {
                    var slug = fname.replace(/\..+/, ''),
                        stat = fs.statSync(path.join(dir, fname));

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

            if (!options.includeStatic) {
                fileList = fileList.filter(function(file) {
                    return !(site.pageData[file.slug] && site.pageData[file.slug].isStatic);
                });
            }

            if (options.sortByTime) {
                fileList.sort(function(a, b) {
                    if (options.sortByTime === 'DESC') {
                        return b.time - a.time;
                    } else {
                        return a.time - b.time;
                    }
                });
            }

            if (options.limit) {
                fileList = fileList.slice(0, options.limit);
            }

            def.resolve(fileList);
        });

        return def.promise;
    }


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
};