
var fs = require('fs'),
    path = require('path'),
    jade = require('jade'),
    q = require('q'),
    render = require('./renderer.js');

function getContentForRoute(url, site) {
    var def = q.defer();

    fs.exists(path.join(site.contentDir, url + '.md'), function(exists) {
        var content;

        if (exists) {
            
            // strip leading slash and render the content
            content = render(url.substr(1), site);
            
            if (content instanceof Error) {
                content.status = 500;
                def.reject(content);
            } else {
                def.resolve(content);
            }

        } else {

            fs.exists(path.join(site.contentDir, url + '.jade'), function(exists) {
                if (exists) {

                    def.resolve(jade.renderFile(path.join(site.contentDir, url + '.jade'), {
                        url: url
                    }));

                } else {
                    fs.exists(path.join(site.contentDir, url, 'index.jade'), function(exists) {
                        var err;

                        if (exists) {

                            def.resolve(jade.renderFile(path.join(site.contentDir, url + '/index.jade'), {
                                url: url
                            }));

                        } else {
                            err = new Error('Sorry, but that page does not exist: ' + url);
                            err.status = 404;
                            def.reject(err);
                        }
                    });
                }
            });
        }
    });

    return def.promise;
}

function getRedirectUrl(url, site) {
    var redirect = null,
        rules = site.urlRedirects || [];

    rules.forEach(function(rule) {
        var re = new RegExp(rule.match);
        if (re && re.test(url)) {
            console.log('found redirect match:', rule.redirect);
            if (/\$/.test(rule.redirect)) {
                redirect = url.replace(re, rule.redirect);
            } else {
                redirect = rule.redirect;
            }
        }
    });

    return redirect;
}

module.exports = function(app, site) {
    var api = require('./api.js')(site);

    // Homepage (index) router
    app.get('/', function(req, res, next) {
        var content = render('home', site);
        
        if (content instanceof Error) {
            content.status = 500;
            next(content);
        } else {
            res.send(content);
        }
    });

    // API endpoints
    app.get('/api/content', api.getAllContent);
    app.get('/api/content/posts', api.getAllPosts);
    app.get('/api/content/posts/recent', api.getRecentPosts);

    // Router for all other pages/posts
    app.get('*', function(req, res, next) {
        // Site redirects
        var redirect = getRedirectUrl(req.url, site);
        if (redirect) {
            res.redirect(301, redirect);
            return;
        }

        // All other content
        getContentForRoute(req.url, site)
            .then(function(content) {
                res.send(content);
            })
            .fail(function(err) {
                next(err);
            });
    });

};
