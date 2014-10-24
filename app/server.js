
var express = require('express'),
    vhost = require('vhost'),
    path = require('path'),
    _ = require('lodash'),
    config = require('./config.json'),
    options = {},
    sites = {};


// ---------------- Primary vhost Server Config --------------- //

// This is the primary server, the one that delegates to the vhost app handlers
var server = express();

// -------------- Server Options Setup and Audits ------------- //

_.extend(options, config);
if (server.get('env') === 'development') {
    _.extend(options, config.devOptions || {});
}

if (!Array.isArray(options.sites) || !options.sites.length) {
    throw new Error('Please provide an array of sites to host!');
}

console.log('Starting vhost server with config: ', JSON.stringify(options));

// ------------------- Main Server Config --------------------- //

server.set('port', options.port || 8686);
server.use(express.static(path.join(__dirname, 'app/public')));


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
        throw new Error('Duplicate host dedected: ' + site.host);
    }

    // Create vhost's express app and set up routes
    sites[site.slug] = express();
    require('./router')(sites[site.slug], site);
    server.use(vhost(site.host, sites[site.slug]));
    usedHosts.push(site.host);

    console.log('Added vhost for "' + site.slug + '" at "' + site.host + '"');
});


// ------------------- Main Server Startup ------------------ //

server.listen(server.get('port'), function() {
    console.info('vhost server started successfully on port ' + server.get('port'));
});
