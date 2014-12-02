window.jk = (function ($) {

    console.log('JK client startup...');

    var PAGE_LIMIT = 5;

    function init() {
        var skip = getQueryParam('skip');

        loadRecentPosts({
            skip: skip || 0
        });
    }

    function toMixedCase(text) {
        return text.replace(/\-/g, ' ').replace(/\w*/g, function(t){ return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase(); });
    }

    function getQueryParam(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(document.location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function loadRecentPosts(options) {
        var recent = $('.recent-posts'),
            prevPage = $('a.prev-page'),
            nextPage = $('a.next-page');
        
        if (recent.length) {
            getPosts({ skip: options.skip || 0 }, function(err, data) {
                if (err) {
                    recent.append('<p class="error">' + err + '</p>');
                    return;
                }

                recent.append(getPostHtml(data.files).join(''));

                if (data.hasPrevPage) {
                    prevPage.show().attr('href', '?skip=' + data.prevSkip);
                } else {
                    prevPage.hide();
                }

                if (data.hasNextPage) {
                    nextPage.show().attr('href', '?skip=' + data.nextSkip);
                } else {
                    nextPage.hide();
                }
            });
        }
    }

    function getPosts(options, cb) {
        cb = cb || $.noop;

        $.ajax({
            url: '/api/content/posts/recent?skip=' + (options.skip || 0),
            dataType: 'json',
            success: function(data) {
                cb(null, data);
            },
            error: function(xhr) {
                console.warn(xhr.status, xhr.responseText);
                cb("Sorry, but there was a problem retrieving blog posts.");
            }
        });
    }

    function getPostHtml(files) {
        var posts = [];

        for (var i=0, l=files.length; i<l; ++i) {
            posts.push(
                '<article>' +
                '<h3><a href="' + files[i].slug + '">' + 
                toMixedCase(files[i].slug) + 
                '</a></h3>' +
                '<p>' + files[i].brief + '</p>' +
                '</article>'
            );
        }

        return posts;
    }

    return {
        init: init,
        toMixedCase: toMixedCase,
        getQueryParam: getQueryParam
    };

})(window.jQuery);