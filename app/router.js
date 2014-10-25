
var fs = require('fs'),
    path = require('path'),
    jade = require('jade'),
    render = require('./renderer.js');

module.exports = function(app, options) {

    // Homepage (index) router
    app.get('/', function(req, res) {
        res.send(render('home', options));
    });

    // router for all other pages/posts
    app.get('*', function(req, res) {
        return routeToContent(req, res, options);
    });

};

function routeToContent(req, res, options) {
    console.log('Routing to ' + req.url);
    fs.exists(path.join(options.contentDir, req.url + '.md'), function(exists) {
        if (exists) {
            
            // strip leading slash and render the content
            res.send(render(req.url.substr(1), options));

        } else {
            fs.exists(path.join('templates', options.template, '404.jade'), function(exists) {
                var rendering = (exists) ? jade.renderFile(path.join('templates', options.template, '404.jade')) : 'Not found';
                res.status(404).send(rendering);
            });
        }
    });
}