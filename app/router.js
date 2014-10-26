
var fs = require('fs'),
    path = require('path'),
    jade = require('jade'),
    render = require('./renderer.js');

module.exports = function(app, site) {
    var api = require('./api.js')(site);

    // Homepage (index) router
    app.get('/', function(req, res) {
        res.send(render('home', site));
    });

    // API endpoints
    app.get('/api/content', api.getAllContent);
    app.get('/api/content/posts', api.getAllPosts);

    // Router for all other pages/posts
    app.get('*', function(req, res) {
        return routeToContent(req, res, site);
    });

};

function routeToContent(req, res, site) {
    console.log('Routing to ' + req.url);
    fs.exists(path.join(site.contentDir, req.url + '.md'), function(exists) {
        if (exists) {
            
            // strip leading slash and render the content
            res.send(render(req.url.substr(1), site));

        } else {
            fs.exists(path.join('templates', site.template, '404.jade'), function(exists) {
                var rendering = (exists) ? jade.renderFile(path.join('templates', site.template, '404.jade')) : 'Not found';
                res.status(404).send(rendering);
            });
        }
    });
}