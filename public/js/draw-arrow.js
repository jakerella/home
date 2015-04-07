window.drawarrow = (function(app) {
    'use strict';
    
    var nextId = 0,
        triangleWidth = 3;
    
    app.init = function() {
        var arrows = [].slice.call( document.querySelectorAll( '[data-arrow]' ) );
        arrows.forEach(processArrow);
    };

    function processArrow(node) {
        if (node.tagName.toLowerCase() !== 'svg') { return; }

        var options = node.dataset['arrow'] || "{}";
        
        try {
            options = JSON.parse(options);
        } catch(err) {
            console.warn('Unable to draw arrow for node', node, options);
        }
        
        options.length = Number(options.length) || 100;
        options.thickness = Number(options.thickness) || 15;
        options.direction = Number(options.direction) || 0;
        options.color = options.color || 'red';
        
        var markerHeight = (options.thickness * triangleWidth);
        
        if (options.direction === 0 || options.direction === 2) {
            node.setAttribute('viewBox', [
                (markerHeight / 2) * -1,
                0,
                markerHeight,
                options.length
            ].join(' '));
            node.style.width = markerHeight + 'px';
            node.style.height = options.length + 'px';
        } else {
            node.setAttribute('viewBox', [
                0,
                (markerHeight / 2) * -1,
                options.length,
                markerHeight
            ].join(' '));
            node.style.width = options.length + 'px';
            node.style.height = markerHeight + 'px';
        }
        
        node.innerHTML = getArrow(options);
    }
    
    function getArrow(options) {
        var markerHeight = (options.thickness * triangleWidth),
            lineCoor = 'M0,' + options.length + ' L0,' + markerHeight;
        
        if (options.direction === 1) {
            lineCoor = 'M-' + (options.length / 2) + ',0 L' + (options.length - markerHeight) + ',0';
        } else if (options.direction === 2) {
            lineCoor = 'M0,0 L0,' + (options.length - markerHeight);
        } else if (options.direction === 3) {
            lineCoor = 'M' + options.length + ',0 L' + markerHeight + ',0';
        }
        
        return [
            '<defs>',
                '<marker id="arrow-tip-' + (++nextId) + '" markerWidth="' + triangleWidth + '" markerHeight="4" refx="0.1" refy="2" orient="auto">',
                    '<path d="M-1,0 V4 L3,2 Z" style="fill:' + options.color + ';" />',
                '</marker>',
            '</defs>',
            '<path',
                'marker-end="url(#arrow-tip-' + nextId + ')"',
                'stroke-width="' + options.thickness + '" fill="none" stroke="' + options.color + '"',
                'd="' + lineCoor + '"',
            '/>'
        ].join(' ');
    }

    return app;

})(window.srcbyline || {});
