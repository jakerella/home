
var path = require('path'),
    jade = require('jade'),
    _ = require('lodash');

module.exports = function (slug, site) {
    var data = site.pageData[slug] || {};

    data.slug = slug;
    data.template = data.template || site.defaultTemplate || 'base.jade';
    data.title = data.title || site.title || 'My Site - %slug%';

    _.extend(data, {
        renderContent: function() {
            return jade.render(
                'include:markdown ' + path.join(site.contentDir, slug + '.md'),
                { filename: 'FOOBAR' } // this option must be here, but is not used
            );
        }
    });

    data.title = data.title.replace(/%slug%/g, slug.replace(/\-/g, ' ').replace(/\w*/g, function(t){ return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase(); }));

    return jade.renderFile(path.join('templates', site.template, data.template), data);
};
