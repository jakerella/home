
var path = require('path'),
    jade = require('jade'),
    _ = require('lodash');

module.exports = function (slug, options) {
    var data = options.pageData[slug] || {};

    data.template = data.template || options.defaultTemplate || 'base.jade';
    data.title = data.title || options.title || 'My Site - %slug%';

    _.extend(data, {
        renderContent: function() {
            return jade.render(
                'include:markdown ' + path.join(options.contentDir, slug + '.md'),
                { filename: 'FOOBAR' } // this option must be here, but is not used
            );
        }
    });

    data.title = data.title.replace(/%slug%/g, slug.replace(/\-/g, ' ').replace(/\w*/g, function(t){ return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase(); }));

    return jade.renderFile(path.join('templates', options.template, data.template), data);
};
