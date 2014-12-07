
var express = require('express'),
    serveStatic = require('serve-static'),
    router = require('./helpers/router.js'),
    options = require('./config.json');


// ---------------- Primary Server Config --------------- //

var server = express();
server.set('port', options.port || process.env.PORT || 3000);

require('marked').setOptions(require('./helpers/markdownOptions.js')({
    'tags': options.tagTemplate
}));


server.use(serveStatic(options.publicDir));
router(server, options);

server.use(require('./helpers/httpErrors.js')(options));



// ------------------- Main Server Startup ------------------ //

server.listen(server.get('port'), function() {
    console.info('Server started successfully on port ' + server.get('port'));
});
