window.jk = (function ($) {

    console.log('JK client startup...');

    var PAGE_LIMIT = 5,
        DEFAULT_TEMPLATE = '<article><h3><a href="/{{slug}}">{{title}}</a></h3><p>{{brief}}</p></article>',
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
            },
        ];


    function init(options) {
        var skip = getQueryParam('skip');

        options = options || {};
        options.skip = options.skip || 0;
        options.node = options.node || '.recent-posts';
        options.template = options.template || DEFAULT_TEMPLATE;

        loadRecentPosts(options);
    }

    function toMixedCase(text) {
        return text.replace(/\w*/g, function(t){ return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase(); });
    }

    function getQueryParam(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(document.location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function loadRecentPosts(options) {
        var recent,
            prevPage = $('a.prev-page'),
            nextPage = $('a.next-page');
        
        options = options || {};

        recent = $(options.node);
        if (recent.length) {
            getPosts({ skip: options.skip || 0 }, function(err, data) {
                if (err) {
                    recent.append('<p class="error">' + err + '</p>');
                    return;
                }

                recent.append(getPostHtml(data.files, options.template).join(''));

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

    function getPostHtml(files, template) {
        var posts = [];

        for (var i=0, l=files.length; i<l; ++i) {
            files[i].title = toMixedCase(files[i].slug.replace(/\-/g, ' '));
            posts.push(renderPostTemplate(files[i], template));
        }

        return posts;
    }

    function renderPostTemplate(data, template) {
        var i, l, content,
            html = template || "";

        for (i=0, l=TEMPLATE_DATA.length; i<l; ++i) {
            content = (TEMPLATE_DATA[i].process && TEMPLATE_DATA[i].process(data[TEMPLATE_DATA[i].property])) || data[TEMPLATE_DATA[i].property] || '';
            html = html.replace(new RegExp('\\{\\{' + TEMPLATE_DATA[i].key + '\\}\\}', 'g'), content);
        }

        return html;
    }

    return {
        init: init,
        toMixedCase: toMixedCase,
        getQueryParam: getQueryParam,
        sidebarPostsTemplate: '<article><h3><a href="/{{slug}}">{{title}}</a></h3><p class="published-on">{{published}}</p></article>',
    };

})(window.jQuery);