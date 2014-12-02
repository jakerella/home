
var contentHelper;

module.exports = function(site) {
    contentHelper = require('./contentHelper.js')(site);

    // --------------- Public API methods --------------------- //
    return {
    
        getAllContent: function(req, res) {
            contentHelper.getContent({
                dir: site.contentDir,
                includeStatic: true,
                limit: 0
            })
                .then(function(data) {
                    res.json(data.files);
                })
                .fail(function(err) {
                    console.log('API ERROR (getAllContent): ' + err);
                    res.status(500).send('Unable to complete request');
                });
        },

        getAllPosts: function(req, res) {
            contentHelper.getContent({
                dir: site.contentDir,
                includeStatic: false,
                limit: 0
            })
                .then(function(data) {
                    res.json(data);
                })
                .fail(function(err) {
                    console.log('API ERROR (getAllPosts): ' + err);
                    res.status(500).send('Unable to complete request');
                });
        },

        getRecentPosts: function(req, res) {
            contentHelper.getContent({
                dir: site.contentDir,
                includeStatic: false,
                limit: site.pageSearchLimit || 5,
                sortByTime: 'DESC',
                skip: Number(req.query.skip) || 0
            })
                .then(function(data) {
                    res.json(data);
                })
                .fail(function(err) {
                    console.log('API ERROR (getRecentPosts): ' + err);
                    res.status(500).send('Unable to complete request');
                });
        }

    };

};