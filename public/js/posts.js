(function (jk, $) {

    var DEFAULT_TEMPLATE = '<article><h3><a href="/{{slug}}">{{title}}</a></h3><p>{{brief}}</p></article>',
        TEMPLATE_DATA = [
            {
                key: 'slug',
                property: 'slug'
            },
            {
                key: 'title',
                property: 'title'
            },
            {
                key: 'brief',
                property: 'brief'
            },
            {
                key: 'modified',
                property: 'modtime',
                process: function(data) {
                    var d = new Date(data);
                    return (d && ((d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear())) || data;
                }
            },
            {
                key: 'published',
                property: 'publishTime',
                process: function(data) {
                    var d = new Date(data);
                    return (d && ((d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear())) || data;
                }
            },
            {
                key: 'tags',
                property: 'tags',
                process: function(data) {
                    return (data && data.join && data.join(', ')) || data;
                }
            }
        ];


    function init(options) {
        console.debug('initializing posts module', this, options);

        var skip = jk.getQueryParam('skip');

        options = options || {};
        options.skip = options.skip || skip || 0;
        options.$node = $(options.node || '.recent-posts');
        options.template = options.template || DEFAULT_TEMPLATE;

        getRecentPosts(options, function(err, data) {
            if (err) {
                options.$node.append('<p class="error">' + err + '</p>');
                return;
            }

            displayRecentPosts(data, options);
        });
    }

    function displayRecentPosts(data, options) {
        var prevPage = $('a.prev-page'),
            nextPage = $('a.next-page');

        options.$node.append(getPostHtml(data.files, options.template).join(''));

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
    }

    function getRecentPosts(options, cb) {
        options = options || {};
        cb = cb || $.noop;

        $.ajax({
            url: '/api/content/posts/recent?skip=' + (options.skip || 0),
            dataType: 'json',
            success: function(data) {
                cb(null, data);
            },
            error: function(xhr) {
                console.warn(xhr.status, xhr.responseText);
                cb('Sorry, but there was a problem retrieving blog posts.');
            }
        });
    }

    function getPostHtml(files, template) {
        var i, l,
            posts = [];

        for (i=0, l=files.length; i<l; ++i) {
            files[i].title = jk.toMixedCase(files[i].slug.replace(/\-/g, ' '));
            posts.push(jk.renderTemplate(files[i], template, TEMPLATE_DATA));
        }

        return posts;
    }

    jk.addModule({
        name: 'posts',
        init: init
    });

})(window.jk || {}, window.jQuery);