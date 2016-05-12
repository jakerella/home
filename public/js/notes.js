(function (jk, $) {

    function init(options) {
        console.debug('initializing notes module', options);

        options = options || {};
        options.bin = options.bin || 'misc';

        var data = localStorage.getItem(options.bin);

        var field = $('.edit-notes')
            .val(data)
            .css({
                height: ($('.main-content').height() * 0.95) + 'px'
            })
            .keyup(function() {
                storeData(options.bin, field.val());
            })
            .focus();
    }

    function storeData(bin, data) {
        localStorage.setItem(bin, data);
    }

    jk.addModule({
        name: 'notes',
        init: init
    });

})(window.jk || {}, window.jQuery);
