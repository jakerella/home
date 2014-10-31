(function ($) {

    console.log('JK client startup...');

    function toMixedCase(text) {
        return text.replace(/\-/g, ' ').replace(/\w*/g, function(t){ return t.charAt(0).toUpperCase()+t.substr(1).toLowerCase(); });
    }

    var recent = $('.recent-posts');
    if (recent.length) {
        $.ajax({
            url: '/api/content/posts/recent',
            dataType: 'json',
            success: function(data) {
                var posts = [];

                for (var i=0, l=data.length; i<l; ++i) {
                    posts.push(
                        '<article>' +
                        '<h3><a href="' + data[i].slug + '">' + 
                        toMixedCase(data[i].slug) + 
                        '</a></h3>' +
                        '<p>' + data[i].brief + '</p>' +
                        '</article>'
                    );
                }

                recent.append(posts.join(''));
            }
        });
    }

})(window.jQuery);