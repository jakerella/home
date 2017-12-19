
var express = require('express'),
    serveStatic = require('serve-static'),
    router = require('./helpers/router.js'),
    options = require('./config.json');


// ---------------- Primary Server Config --------------- //

var server = express();
server.set('port', process.env.PORT || options.port || 3000);

require('marked').setOptions(require('./helpers/markdownOptions.js')({
    publishTime: options.publishTimeTemplate || null,
    tags: options.tagsTemplate || null
}));

server.use(function(req, res, next) {
    if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] === 'http') {
        return res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
    }
    next();
});

server.use(serveStatic(options.publicDir));
router(server, options);

server.use(require('./helpers/httpErrors.js')(options));



// ------------------- Main Server Startup ------------------ //

server.listen(server.get('port'), function() {
    console.info('Server started successfully on port ' + server.get('port'));
});
