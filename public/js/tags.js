(function (jk, $) {

    function init(options) {
        console.debug('initializing tags module', options);

        options = options || {};
        var elem = $(options.elem);
        if (!elem.length) { return; }

        $.ajax({
            url: '/api/content/tags',
            dataType: 'json',
            success: function(data) {
                createTagCloud(elem, data);
            },
            error: function(xhr) {
                console.warn(xhr.status, xhr.responseText);
                elem.html('<p class="error">(Unable to load tags)</p>');
            }
        });
    }

    function createTagCloud(elem, data) {
        var html = ['<ul>'];
        var tags = Object.keys(data);

        tags.forEach(function tagLoop(tag) {
            html.push('<li class="tag tag-size-' + getTagSize(data[tag].length) + '">');
            html.push('<a href="/tag/' + tag.replace(/\s/g, '+') + '" title="See posts with this tag">' + tag + '</a>');
            html.push('</li>');
        });

        html.push('</ul>');
        elem.html(html.join(''));
    }

    function getTagSize(postCount) {
        var size = 'tiny';
        postCount = postCount || 0;
        if (postCount > 15) {
            size = 'enormous';
        } else if (postCount > 10) {
            size = 'massive';
        } else if (postCount > 7) {
            size = 'large';
        } else if (postCount > 4) {
            size = 'medium';
        } else if (postCount > 1) {
            size = 'small';
        }
        return size;
    }

    jk.addModule({
        name: 'tags',
        init: init
    });

})(window.jk || {}, window.jQuery);
