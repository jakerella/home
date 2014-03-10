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
        handleCommand, commandComplete, addOutput, scrollToBottom,
        showPrevHistory, showNextHistory, showHistoryEntry,
        clearOutput, showHistory, showHelp,
        defaults = {
            initialPrompt: '$',
            classPrefix: 'brsh',
            eventPrfix: 'brsh',
            commandHandler: function(c,cb) { cb(); }
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
                this.value = '';
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
        $el.clear = clearOutput.bind($el);
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

        this.find('.' + o.classPrefix + '-input').hide();
        this.output("<span class='" + o.classPrefix + "-prompt'>$</span> " + input);

        if (!command) {
            commandComplete.bind(this)();
            return null;
        }

        this._history.push(input);
        this._historyPointer = this._history.length;
        localStorage.brshHistory = JSON.stringify(this._history);

        this.trigger(options.eventPrfix + '.command', [command, params, options]);

        // Check for a command-specific handler, otherwise call the generic version
        if (o.commands[command]) {
            o.commands[command].bind(this)([command, params, options], commandComplete.bind(this));
        } else {
            o.commandHandler([command, params, options], commandComplete.bind(this));
        }

        return [command, params, options];
    };

    commandComplete = function() {
        var o = this._options || {};

        this.find('.' + o.classPrefix + '-input').show();
        scrollToBottom.bind(this)(false);
    };

    addOutput = function(output) {
        var lines,
            contentLines = [],
            o = this._options || {};

        output = '' + output;
        
        lines = output.split(/\n/);

        lines.forEach(function buildLine(line) {
            contentLines.push("<p class='" + o.classPrefix + "-line'>" + line + "</p>");
        });

        this.find('.' + o.classPrefix + '-output').append(contentLines.join("\n"));
        scrollToBottom.bind(this)(true);
    };

    scrollToBottom = function(hideInput) {
        var o = this._options || {};

        hideInput = !!hideInput;

        output = this.find('.' + o.classPrefix + '-output');
        input = this.find('.' + o.classPrefix + '-input');
        this.scrollTop(output.height() - this.height() + input.show().height());
        if (hideInput) {
            input.hide();
        }
    };

    showPrevHistory = function() {
        showHistoryEntry.bind(this)(this._historyPointer - 1);
    };

    showNextHistory = function() {
        var index = this._historyPointer + 1;
        if (this._history[index]) {
            showHistoryEntry.bind(this)(index);
        } else {
            this._historyPointer = this._history.length;
            this.find('input').val('');
            scrollToBottom.bind(this)(false);
        }
    };

    showHistoryEntry = function(index) {
        if (this._history[index]) {
            this._historyPointer = index;
            this.find('input').val(this._history[this._historyPointer]);
            scrollToBottom.bind(this)(false);
        }
    };


    // ---------------- Command Handlers ---------------- //

    clearOutput = function(command, cb) {
        var o = this._options || {};
        this.find('.' + o.classPrefix + '-output').empty();
        cb();
    };

    showHistory = function(command, cb) {
        this.output(this._history.join("\n"));
        cb();
    };

    showHelp = function(command, cb) {
        cb();
    };


    // We need to assign these down here, otherwise the variables will be undefined!
    defaults.commands = {
        clear: clearOutput,
        history: showHistory,
        help: showHelp
    };

    return BrowserShell;

}));