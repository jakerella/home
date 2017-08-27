window.runCode = (function(app) {
    'use strict';

    var runnableId = 0;

    app.init = function() {
        var codez = [].slice.call( document.querySelectorAll( '.runnable' ) );

        codez.forEach(function(source) {
            var pre = source.parentNode;
            runnableId++;

            source.setAttribute('id', 'runnable-' + runnableId);
            source.setAttribute('contenteditable', 'true');

            pre.innerHTML +=
                '<button class="code-run" data-run="code-foo">Run</button>' +
                '<aside id="run-result-' + runnableId + '" class="code-result" data-source="code-foo"></aside>';

            if (window.hljs) {
                pre.querySelector('.runnable').addEventListener('blur', function() {
                    window.hljs.highlightBlock( pre.querySelector('.runnable') );
                });
            }

            pre.querySelector('.code-run').addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector('#run-result-' + runnableId).innerHTML = '';
                var sourceElement = document.querySelector('#runnable-' + runnableId);
                var code = sourceElement.innerText;
                if (sourceElement.classList.contains('runnable-log-output')) {
                    code = 'console.log(' + code + ');';
                }

                var newCode = '(function() {\n' +
                    'var log = window.console.log;\n' +
                    'var results = "#run-result-' + runnableId + '";\n' +
                    'window.console.log = ' + printLog.toString() + ';\n' +
                    code + '\n' +
                    '; window.console.log = log;\n' +
                ';})();';
                eval(newCode);
            });
        });
    };

    function printLog() {
        log.apply(window.console, [].slice.call(arguments));
        var allOutput = [].slice.call(arguments).map(function(output) {
            if (output.splice) {
                return '[ ' + output.map(function(element) {
                    if (typeof(element) === 'object') {
                        return JSON.stringify(element);
                    } else {
                        return element.toString();
                    }
                }).join(', ') + ' ]';
            } else if (typeof(output) === 'object') {
                return JSON.stringify(output, undefined, 2);
            } else {
                return output.toString();
            }
        });
        if (document.querySelector(results).innerHTML.length) {
            allOutput.unshift(document.querySelector(results).innerHTML);
        }
        document.querySelector(results).innerHTML = allOutput.join('<br>');
    }

    return app;

})({});
