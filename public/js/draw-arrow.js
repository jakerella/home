window.drawarrow = (function(app) {
    'use strict';
    
    var nextId = 0,
        triangleWidth = 3;
    
    app.init = function() {
        var arrows = [].slice.call( document.querySelectorAll( '[data-arrow]' ) );
        
        arrows.forEach(function(node) {
            var options = getOptions(node);
            
            if (node.tagName.toLowerCase() === 'code' && node.parentNode.tagName.toLowerCase() === 'pre') {
                
                generateSVG(node, options);
                
            } else if (node.tagName.toLowerCase() === 'svg') {
                
                processArrow(node, options);
                
            }
        });
    };

    function getOptions(node) {
        var options,
            optionsString = node.dataset['arrow'] || "{}";
        
        try {
            
            options = JSON.parse(optionsString);
            
        } catch(err) {
            console.warn('Invalid options specified for arrow!', node, optionsString);
        }
        
        options = options || {};
        
        options.length = Number(options.length) || 100;
        options.thickness = Number(options.thickness) || 15;
        options.direction = Number(options.direction) || 0;
        options.color = options.color || 'red';
        options.horizPadding = options.horizPadding || 3;
        options.vertPadding = options.vertPadding || 0;
        
        return options;
    }
    
    function generateSVG(node, options) {
        var codeText = node.innerText.split(/\n/),
            lineHeight = window.getComputedStyle(node).getPropertyValue('line-height'),
            lineUnits = lineHeight.match(/[^0-9\.]+$/)[0];
        
        if (!options.codelines || !options.codelines.splice || !options.codelines.length) {
            console.warn('No lines specified for code arrows! Use: {"codelines": [1, 5, ...]} (defaulting to [1])', options);
            options.codelines = [1];
        }
        
        options.codelines.forEach(function(line) {
            
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
                lineText = codeText[ (line - 1) ];
            
            if (!lineText) {
                console.warn('Skipped non-existant line:', line);
                return;
            }
            
            processArrow(svg, options);
            
            svg.style.position = 'absolute';
            svg.style.top = ((parseFloat(lineHeight, 10) * (line - 1)) + options.vertPadding) + lineUnits;
            svg.style.left = (lineText.length + options.horizPadding) + 'ex';
            
            node.parentNode.appendChild(svg);
        });
        
        node.parentNode.style.position = 'relative';
    }

    function processArrow(node, options) {
        var markerHeight = (options.thickness * triangleWidth),
            lineCoor = 'M0,' + options.length + ' L0,' + markerHeight;
        
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
        
        if (options.direction === 1) {
            lineCoor = 'M-' + (options.length / 2) + ',0 L' + (options.length - markerHeight) + ',0';
        } else if (options.direction === 2) {
            lineCoor = 'M0,0 L0,' + (options.length - markerHeight);
        } else if (options.direction === 3) {
            lineCoor = 'M' + options.length + ',0 L' + markerHeight + ',0';
        }
        
        node.innerHTML = [
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
