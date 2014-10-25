
var render = require('./renderer.js');

module.exports = function(app, options) {

    // Homepage (index) router
    app.get('/', function(req, res) {
        res.send(render('home', options));
    });

    // router for all other pages/posts
    app.get('*', function(req, res) {
        res.send(render('home', options));
    });

};
