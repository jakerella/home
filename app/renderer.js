
var path = require('path'),
    jade = require('jade');

module.exports = function (slug, options) {
    return jade.renderFile(path.join('templates', options.template, 'base.jade'), {
        title: (options.title || 'My Site'),
        renderContent: function() {
            return jade.render(
                'include:markdown ' + path.join(options.contentDir, slug + '.md'),
                {
                    filename: 'base'
                }
            );
        }
    });
};
