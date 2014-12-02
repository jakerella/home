
var express = require('express'),
    vhost = require('vhost'),
    serveStatic = require('serve-static'),
    path = require('path'),
    _ = require('lodash'),
    router = require('./helpers/router.js'),
    config = require('./config.json'),
    options = {},
    sites = {};


// ---------------- Primary vhost Server Config --------------- //

// This is the primary server, the one that delegates to the vhost app handlers
var server = express();


// ----------------- Server Options and Audits ---------------- //

_.extend(options, config);
if (server.get('env') === 'development') {
    _.extend(options, config.devOptions || {});
}

if (!Array.isArray(options.sites) || !options.sites.length) {
    throw new Error('Please provide an array of sites to host!');
}

server.set('port', options.port || 8686);

console.log('Starting vhost server with config: ', JSON.stringify(options));

require('marked').setOptions(require('./helpers/markdownOptions.js')(options));


// ------------------ Individual vhost Config ----------------- //

var usedHosts = [];
options.sites.forEach(function(site) {
    // Audit site minimimum options
    if (!site.slug || !site.host || !site.contentDir) {
        throw new Error('Each site must contain a slug, host, and contentDir!');
    }

    if (server.get('env') === 'development') {
        _.extend(site, site.devOptions || {});
    }

    if (sites[site.slug]) {
        throw new Error('Duplicate site slug detected: ' + site.slug);
    }
    if (usedHosts.indexOf(site.host) > -1) {
        throw new Error('Duplicate host detected: ' + site.host);
    }
    site.template = site.template || 'sample';
    site.publicDir = site.publicDir || 'public';
    site.pageData = site.pageData || {};

    // Create vhost's express app and set up routes
    sites[site.slug] = express();
    
    sites[site.slug].use(serveStatic(path.join('templates', site.template, site.publicDir)));
    sites[site.slug].use(serveStatic(path.join('content', site.template, site.publicDir)));
    router(sites[site.slug], site);
    
    server.use(vhost(site.host, sites[site.slug]));
    usedHosts.push(site.host);

    sites[site.slug].use(require('./helpers/httpErrors.js')(site));

    console.log('Added vhost for "' + site.slug + '" at "' + site.host + '"');
});


// ----------------- Error Handling for vhost ---------------- //

server.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Sorry, but there was a nasty error. Please try again later.');
});


// ------------------- Main Server Startup ------------------ //

server.listen(server.get('port'), function() {
    console.info('vhost server started successfully on port ' + server.get('port'));
});
