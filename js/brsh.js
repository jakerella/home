(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["jquery"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("jquery"));
    } else {
        root.BrowserShell = factory(root.jQuery);
    }
} (this, function ($) {

    var BrowserShell, init, createStructure, attachEvents,
        handleCommand, addOutput, showPrevHistory, showNextHistory, showHistory
        defaults = {
            initialPrompt: '$',
            classPrefix: 'brsh',
            eventPrfix: 'brsh'
        };

    BrowserShell = function(node, options) {
        var $el = $(node);
        
        options = (options || {});

        if ($el.length) {
            init($el, $.extend({}, defaults, options));
            return $el;
        }

    };

    init = function($el, options) {
        $el._options = options;
        $el._prompt = options.initialPrompt;
        
        if (localStorage && localStorage.brshHistory) {
            $el._history = JSON.parse(localStorage.brshHistory);
        } else {
            $el._history = [];
        }
        $el._historyPointer = $el._history.length;

        createStructure($el);
        attachEvents($el);

        $el.trigger(options.eventPrfix + '.init');
    };

    createStructure = function($el) {
        var o = $el._options || {};

        $el
            .addClass('brsh-console')
            .append("<section class='" + o.classPrefix + "-output'>" +
                "</section><section class='" + o.classPrefix + "-input'>" +
                "<span class='" + o.classPrefix + "-prompt'>$</span> " +
                "<input type='text' /></section>");

        $el.trigger(o.eventPrfix + '.DOMReady');
    };

    attachEvents = function($el) {
        var o = $el._options || {};

        $el.find('input').keypress(function handleKeypress(e) {
            if (e.keyCode === 13) {
                // enter (execute command)
                $el.command(this.value);
            } else if (e.keyCode === 38) {
                // up arrow (prev in history)
                $el.prevHistory();
            } else if (e.keyCode === 40) {
                // down arrow (next in history)
                $el.nextHistory();
            }
        });

        $el.command = handleCommand.bind($el);
        $el.output = addOutput.bind($el);
        $el.prevHistory = showPrevHistory.bind($el);
        $el.nextHistory = showNextHistory.bind($el);
    };

    handleCommand = function(input) {
        var all, command,
            params = [],
            options = [],
            o = this._options || {};

        all = input.split(/\s/);

        all.forEach(function loopInput(item, i) {
            var option;

            item = item.trim();

            if (!item.length) { return; }

            if (!command) {
                command = item;
            } else if (/^\-\-.+/.test(item)) {
                option = item.split(/\=/);
                options.push([ option[0].substr(2), (option[1] || null) ]);
            } else {
                params.push(item);
            }
        });

        this.output("<span class='" + o.classPrefix + "-prompt'>$</span> " + input);

        if (!command) {
            return null;
        }

        this._history.push(input);
        this._historyPointer = this._history.length;
        localStorage.brshHistory = JSON.stringify(this._history);

        this.trigger(options.eventPrfix + '.command', [command, params, options]);

        return [command, params, options];
    };

    addOutput = function(output, doClearInput) {
        var lines,
            contentLines = [],
            o = this._options || {};

        output = '' + output;
        doClearInput = (doClearInput === false) ? false : true;
        
        lines = output.split(/\n/);

        lines.forEach(function buildLine(line) {
            contentLines.push("<p class='" + o.classPrefix + "-line'>" + line + "</p>");
        });

        this.find('.' + o.classPrefix + '-output')
            .append(contentLines.join("\n"));

        if (doClearInput) {
            this.find('input').val('');
        }
    };

    showPrevHistory = function() {
        showHistory.bind(this)(this._historyPointer - 1);
    };

    showNextHistory = function() {
        var index = this._historyPointer + 1;
        if (this._history[index]) {
            showHistory.bind(this)(index);
        } else {
            this._historyPointer = this._history.length;
            this.find('input').val('');
        }
    };

    showHistory = function(index) {
        if (this._history[index]) {
            this._historyPointer = index;
            this.find('input').val(this._history[this._historyPointer]);
        }
    };


    return BrowserShell;

}));