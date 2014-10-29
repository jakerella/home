
module.exports = {
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
    }
};