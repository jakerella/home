(function (jk, $) {

    var DEFAULT_TEMPLATE = [
            '<li>',
            '<span class="event-name">{{name}}</span>',
            '<span class="event-location">{{location}}</span>',
            '<span class="event-date">{{date}}</span>',
            '<span class="event-topics">{{topics}}</span>',
            '</li>'
        ].join(''),
        TEMPLATE_DATA = [
            {
                key: 'location',
                property: 'location'
            },
            {
                key: 'topics',
                property: 'topics',
                process: function(data) {
                    return data.length ? data.join('; ') : '';
                }
            },
            {
                key: 'name',
                property: 'name',
                process: function(data, fullItem) {
                    return fullItem.url ? '<a href="' + fullItem.url + '" title="Visit this event website">' + data + '</a>' : data;
                }
            },
            {
                key: 'date',
                property: 'date',
                process: function(data, fullItem) {
                    var formatted = data,
                        d = new Date(fullItem.timestamp || data);
                    if (d.getTime()) {
                        formatted = d.toString().substr(4,11).split(/\s/);
                        formatted.splice(1,1);
                        formatted = formatted.join(' ');
                    }
                    return formatted;
                }
            }
        ];


    function init(options) {
        console.debug('initializing events module');

        options = options || {};

        loadEvents(options, function(err, events) {
            var now = new Date();
            now.setHours(0);

            if (!err) {
                
                sortEvents(events, 1);
                addEventsToPage(events, {
                    node: '.upcoming-events',
                    include: function(event) {
                        return (event.timestamp >= now.getTime());
                    }
                });

                sortEvents(events, -1);
                addEventsToPage(events, {
                    node: '.past-events',
                    include: function(event) {
                        return (event.timestamp < now.getTime());
                    }
                });

                jk.adjustContentHeight();
            }
        });
    }

    function loadEvents(options, cb) {
        cb = cb || $.noop;

        $.ajax({
            url: '/events.json',
            dataType: 'json',
            success: function(data) {
                cb(null, data && (data.events || []));
            },
            error: function(xhr) {
                console.warn(xhr.status, xhr.responseText);
                cb('Sorry, but there was a problem retrieving events.');
            }
        });
    }

    function sortEvents(events, dir) {
        dir = Number(dir) || -1;

        events.sort(function(a, b) {
            a.timestamp = a.timestamp || (new Date(a.date)).getTime();
            b.timestamp = b.timestamp || (new Date(b.date)).getTime();

            return (a.timestamp - b.timestamp) * dir;
        });
    }

    function addEventsToPage(events, options) {
        var i, l,
            items = [],
            $node = $(options.node);

        if ($node.length) {
            for (i=0, l=events.length; i<l; ++i) {
                if (options.include(events[i])) {
                    items.push(jk.renderTemplate(events[i], (options.template || DEFAULT_TEMPLATE), TEMPLATE_DATA));
                }
            }

            $node.append(items.join(''));
        }
    }

    jk.addModule({
        name: 'events',
        init: init
    });

})(window.jk || {}, window.jQuery);