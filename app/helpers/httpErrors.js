
var fs = require('fs'),
    path = require('path'),
    jade = require('jade');

module.exports = function(site) {
    var ERROR_MSG = {
        '400': 'Bad Request',
        '403': 'Unauthorized',
        '404': 'Not Found',
        '500': 'Server Error'
    };

    return function(err, req, res, next) {
        console.error('Error on site "' + site.slug + '":', err.stack);
        
        if (err.status) {
            fs.exists(path.join(site.templateDir, err.status + '.jade'), function(exists) {
                var content = ERROR_MSG['' + err.status] || 'Server Error';
                if (exists) {
                    content = jade.renderFile(path.join(site.templateDir, err.status + '.jade'));
                }
                res.status(err.status).send(content);
            });
        } else {
            res.status(500).send('Sorry, but there was a nasty error. Please try again later.');
        }
    };

};
