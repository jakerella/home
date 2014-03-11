(function ($) {

    var brshNode = $('.console');

    BrowserShell(brshNode, {
        initialPrompt: 'jk$'
    });

    brshNode.find('input').focus();


})(window.jQuery);