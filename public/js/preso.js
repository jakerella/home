/*global Reveal*/

// Cut certain sections for shorter-form presentations
(function() {
    var i, j, l, nodes,
        query = document.location.search.match(/(?:\?|&)cut\=(\d+)(?:$|&)/),
        cutLevel = (query && Number(query[1])) || 0;

    for (i=0; i<(cutLevel + 1); ++i) {
        nodes = document.querySelectorAll('.cut-me-' + i);
        for (j=0, l=nodes.length; j<l; ++j) {
            nodes[j].parentNode.removeChild(nodes[j]);
        }
    }
})();

// Full list of configuration options available here:
// https://github.com/hakimel/reveal.js#configuration
Reveal.initialize({
    controls: ((/hide\-controls/.test(document.location.search)) ? false : true),
    progress: false,
    history: true,
    center: true,
    transition: 'linear',
    backgroundTransition: 'slide',

    // Optional libraries used to extend on reveal.js
    dependencies: [
        {
            src: '/js/vendor/reveal.js/lib/js/classList.js',
            condition:function() { return !document.body.classList; }
        },
        {
            src: '/js/vendor/reveal.js/plugin/markdown/marked.js',
            condition: function() { return !!document.querySelector( '[data-markdown]' ); }
        },
        {
            src: '/js/vendor/reveal.js/plugin/markdown/markdown.js',
            condition: function() { return !!document.querySelector( '[data-markdown]' ); }
        },
        {
            src: '/js/vendor/reveal.js/plugin/notes/notes.js',
            async: true,
            condition: function() { return !!document.body.classList; }
        },
        {
            src: '/js/vendor/source-by-line/srcByLine.js',
            async: true,
            callback: function() { window.srcbyline.init(); }
        },
        {
            src: '/js/draw-arrow.js',
            async: true,
            callback: function() { setTimeout(function() { window.drawarrow.init();}, 1000); }
        }
    ]
});

(function toggleFooter() {
    // Check if we want the footer on the current slide
    var footer = document.querySelector('.reveal > footer');
    function checkForFooter(e) {
        var noFooter = e.currentSlide.classList.contains('no-footer') || e.currentSlide.parentNode.classList.contains('no-footer');
        footer.style.display = (noFooter) ? 'none' : 'block';
    }
    Reveal.addEventListener('slidechanged', checkForFooter);
    checkForFooter({ currentSlide: Reveal.getCurrentSlide() });
})();

(function highlightCode() {
    function highlightBlock( event ) {
        window.hljs.highlightBlock( event.currentTarget );
    }

    if( typeof window.addEventListener === 'function' ) {
        var code = document.querySelectorAll( 'pre code' );

        for( var i = 0, len = code.length; i < len; i++ ) {
            var element = code[i];

            // trim whitespace if data-trim attribute is present
            if( element.hasAttribute( 'data-trim' ) && typeof element.innerHTML.trim === 'function' ) {
                element.innerHTML = element.innerHTML.trim();
            }

            // Now escape html unless prevented by author
            if( ! element.hasAttribute( 'data-noescape' )) {
                element.innerHTML = element.innerHTML.replace(/</g,'&lt;').replace(/>/g,'&gt;');
            }

            // re-highlight when focus is lost (for edited code)
            element.addEventListener( 'focusout', highlightBlock, false );
        }
    }

    window.hljs.initHighlighting();

    setTimeout(function() {
        [].slice.call(document.querySelectorAll('pre code'))
            .forEach(function(n) {
                window.hljs.highlightBlock(n);
            });
    }, 1000);

})();
