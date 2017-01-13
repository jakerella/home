(function (jk, $) {

    function init(options) {
        console.debug('initializing notes module', options);

        options = options || {};
        options.bin = options.bin || 'misc';

        var data = localStorage.getItem(options.bin);

        var field = $('.edit-notes')
            .val(data)
            .keydown(function(e) {
                if (e.keyCode === 9) {
                    e.preventDefault();
                }
            })
            .keyup(function(e) {
                var split;
                if (e.keyCode === 9) {
                    split = field[0].selectionStart;
                    field.val(
                        field.val().substr(0, split) +
                        '  ' +
                        field.val().substr(split)
                    );
                    field[0].selectionStart = split + 2;
                    field[0].selectionEnd = split + 2;
                }
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
