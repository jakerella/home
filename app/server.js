
var express = require('express'),
    serveStatic = require('serve-static'),
    path = require('path'),
    _ = require('lodash'),
    router = require('./helpers/router.js'),
    config = require('./config.json'),

    // Site/server options
    options = {
        slug: 'jordankasper',
        port: 8686,
        title: 'Jordan Kasper',
        host: 'jordankasper.com',
        contentDir: 'content',
        publicDir: 'public',
        templateDir: 'templates',
        defaultTemplate: 'post.jade',
        pageData: {
            home: {
                template: 'home.jade',
                title: 'Jordan Kasper',
                isStatic: true
            },
            speaking: {
                template: 'base.jade',
                title: 'Speaking Schedule',
                isStatic: true
            },
            profile: {
                template: 'base.jade',
                title: 'All About Me',
                isStatic: true
            }
        },
        pageSearchLimit: 5,
        briefWordCount: 100,
        urlRedirects: [
            { match: '^/blog$', redirect: '/' },
            { match: '^/blog/(?:[\\d]{4}/[\\d]{2}/)?([^\\/\\?]+)', redirect: '/$1' }
        ],
        tagTemplate: '<p class="post-tags">Tagged with <span class="tag-list">$1</span></p>'
    };


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
