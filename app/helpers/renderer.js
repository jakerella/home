
var fs = require('fs'),
    path = require('path'),
    jade = require('jade'),
    _ = require('lodash'),
    dateFormat = require('dateformat');

/**
 * Renders content for the site based on a slug and the site options
 * @param  {String} slug The URL slug to try and render
 * @param  {Object} site The site options
 * @return {String | Error} Returns the string of content on success, an Error object otherwise
 */
module.exports = {

    renderContent: function (slug, site) {
        var content,
            data = site.pageData[slug] || {};

        data.slug = slug;
        data.template = data.template || site.defaultTemplate || 'page.jade';
        data.title = data.title || (!site.pageData[slug] && site.postTitle) || site.title || '%slug%';

        _.extend(data, {
            renderContent: function() {
                return jade.render(
                    'include:markdown ' + path.join(site.contentDir, slug + '.md'),
                    { filename: 'FOOBAR' } // this option must be here, but is not used
                );
            }
        });

        data.title = data.title.replace(
            /%slug%/g,
            slug.replace(/\-/g, ' ').replace(/\w*/g, function(t) {
                return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase();
            })
        );

        try {
            content = jade.renderFile(path.join(site.templateDir, data.template), data);
        } catch(e) {
            // We'll send back the error instead of content
            // This seems weird, but the way errors are thrown down in here they
            // may not otherwise get caught by the Express error handling middleware
            content = e;
        }

        return content;
    },

    renderSlides: function(slug, site) {
        var data = require(path.join('..', '..', site.publicDir, slug, 'slides.json'));

        data.renderSlideContent = function() {
            var content = '';

            if (/\.jade$/.test(data.slides)) {

                content = jade.render(
                    fs.readFileSync(path.join(site.publicDir, slug, data.slides)),
                    { filename: 'FOOBAR' } // this option must be here, but is not used
                );

            } else if (/\.md$/.test(data.slides)) {

                content = [
                    '<section data-markdown="' + data.slides + '"',
                    'data-separator="^\\r?\\n\\-\\-\\-\\r?\\n"',
                    'data-separator-vertical="^\\r?\\n\\|\\|\\|\\r?\\n"',
                    'data-separator-notes="^\\^"',
                    'data-charset="utf-8">',
                    '</section>'
                ].join(' ');

            } else {
                content = fs.readFileSync(path.join(__dirname, '..', '..', site.publicDir, slug, data.slides));
            }

            content = content.toString('utf-8');
            var includeRegex = /^\s*@include\s(.+)\s*$/gm;
            var match, matches = [];
            /* jshint boss:true */
            while (match = includeRegex.exec(content)) {
                matches.push(match[1]);
            }
            /* jshint boss:false */

            if (matches.length) {
                matches.forEach(function(include) {
                    var partial;
                    try {
                        partial = fs.readFileSync(path.join(__dirname, '..', '..', 'templates', 'slide-partials', include + '.html'));
                    } catch(e) { return; /* If not found, just kick out, no replacement to be done */ }
                    content = content.replace(new RegExp('@include ' + include.replace(/\-/, '\\-'), 'g'), partial.toString('utf-8'));
                });
            }

            return new Buffer(content);
        };

        return jade.renderFile(path.join(site.templateDir, 'preso.jade'), data);
    },

    renderTagPosts: function(tag, site) {
        var contentHelper = require('./contentHelper')(site),
            posts = [],
            tags = contentHelper.getTags();

        tag = tag.replace(/\+/g, ' ');

        if (tags[tag]) {
            tags[tag].forEach(function(post) {
                var title = post.slug
                    .replace(/\-/g, ' ')
                    .replace(/\w*/g, function(t){ return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase(); });
                posts.push({
                    title: title,
                    link: '/' + post.slug,
                    tags: post.tags,
                    published: dateFormat(post.publishTime, 'mmm d, yyyy'),
                    publishTime: post.publishTime
                });
            });

            posts = posts.sort(function(a, b) {
                return b.publishTime - a.publishTime;
            });
        }

        return jade.renderFile(path.join(site.templateDir, 'tag.jade'), { tag: tag, posts: posts });
    }
};
