
var jade = require('jade');

module.exports = function(app, options) {

    app.get('/', function(req, res) {
        res.send(jade.renderFile('app/layout/base.jade', {
            title: (options.title || 'My Site')
        }));
    });

};