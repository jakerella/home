
var marked = require('marked'),
    mdCustomRenderer = new marked.Renderer(),
    metaBlocks = [
        {
            'name': 'publishTime',
            'regex': /\{{2}\s*([^\}]+)\s*\}{2}/g,
            'template': '<p class="publish-time">Published on <date>$1</date></p>\n'
        },
        {
            'name': 'tags',
            'regex': /@@\s([\w\s]+(?:,\s*[\w\s]+)*)/g,
            'template': '<p class="post-tags">Tags: $1</p>'
        }
    ];

module.exports = function(options) {

    mdCustomRenderer.paragraph = function(text) {
        var content = '<p>' + text + '</p>\n';

        metaBlocks.forEach(function(meta) {
            var tmpl = (options && options[meta.name]) || meta.template;
            if (meta.regex.test(text)) {
                content = text.replace(meta.regex, tmpl);
            }
        });

        return content;
    };

    return {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        langPrefix: 'lang-',
        highlight: function(code) {
            return require('highlight.js').highlightAuto(code).value;
        },
        renderer: mdCustomRenderer
    };
};