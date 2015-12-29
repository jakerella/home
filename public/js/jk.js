window.jk = (function (jk, $) {

    jk._modules = {};

    function init(options) {
        jk.options = $.extend({}, options, {
            // defaults
        });

        console.info('JK client startup...', jk.options);

        $.each(jk._modules, function() {
            if (this.init && this.init.apply) {
                this.init(jk.options[this.name] || null);
            }
        });

        // set up document.ready laoding of modules
        $(doLoad);
    }

    function doLoad() {
        $.each(jk._modules, function() {
            if (this.load && this.load.apply) {
                this.load(jk.options[this.name] || null);
            }
        });

        setupHobbesHover();
        adjustContentHeight();
        setupSearch();
    }

    function addModule(module) {
        if (module && module.name) {
            jk._modules[module.name] = module;
        }
    }

    function getModule(name) {
        return jk._modules[name] || null;
    }

    function toMixedCase(text) {
        return text.replace(/\w*/g, function(t){ return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase(); });
    }

    function renderTemplate(data, template, keys) {
        var i, l, content,
            html = template || '';

        keys = keys || [];

        for (i=0, l=keys.length; i<l; ++i) {
            /*jshint maxlen:200*/
            content = (keys[i].process && keys[i].process(data[keys[i].property], data)) || data[keys[i].property] || '';
            /*jshint maxlen:140*/
            html = html.replace(new RegExp('\\{\\{' + keys[i].key + '\\}\\}', 'g'), content);
        }

        return html;
    }

    function getQueryParam(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
            results = regex.exec(document.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    function setupHobbesHover() {
        $('.hobbes-hover')
            .mouseover(function() {
                var img = $(this);
                img
                    .attr('data-oldsrc',  img.attr('src'))
                    .attr('src',  '/images/hobbes_small.png');
            })
            .mouseout(function() {
                var img = $(this);
                img
                    .attr('src',  img.attr('data-oldsrc'));
            });
    }

    function adjustContentHeight() {
        var content = $('.main-content'),
            sh = $('.sidebar').height(),
            ch = content.height();

        console.log(sh, ch);
        if (sh > ch) {
            content.css('min-height', sh + 'px');
        }
    }

    function setupSearch() {
        var input = $('.search [type="query"]');
        $('.search').on('submit', function(e) {
            e.preventDefault();
            window.location.href = [
                'https://www.google.com/?gws_rd=ssl#q=site:jordankasper.com+',
                input.val()
            ].join('');
            return false;
        });

        $('body').on('keypress', function(e) {
            if (e.which === 47 || e.which === 63) {
                e.preventDefault();
                input.focus();
            }
        });
    }

    return {
        init: init,
        addModule: addModule,
        getModule: getModule,
        toMixedCase: toMixedCase,
        renderTemplate: renderTemplate,
        getQueryParam: getQueryParam,
        adjustContentHeight: adjustContentHeight
    };

})(window.jk || {}, window.jQuery);