
var path = require('path'),
    jade = require('jade');

module.exports = {

    build: function (slug, options) {
        return jade.renderFile('app/layout/base.jade', {
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
    }

};
