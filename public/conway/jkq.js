(function() {
    'use strict';

    /**
     * Core method, similar to jQuery (only simpler)
     *
     * @param  {String|HTMLElement} s     The CSS selector to search for or HTML element to wrap with functionality
     * @param  {HTMLElement}        root  OPTIONAL An HTML element to start the element query from
     * @return {Array}                    The collection of elements, wrapped with functionality (see API methods)
     */
    function $(s, root) {
        root = root || document;
        if (typeof(s) === 'string') {
            return wrap([].slice.call( root.querySelectorAll(s) ));
        } else if (s.tagName) {
            return wrap( [s] );
        } else {
            return [];
        }
    }

    /* ---------------- API methods ----------------- */

    var api = {
        append: append,
        prepend: prepend,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        css: css,
        find: find,
        data: data,
        on: on
    };

    function append(el) {
        var html = (typeof(el) === 'string') ? el : el.outerHTML;
        this.innerHTML += html;
    }

    function prepend(el) {
        var html = (typeof(el) === 'string') ? el : el.outerHTML;
        this.innerHTML = html + this.innerHTML;
    }

    function addClass(c) {
        this.classList.add(c);
    }

    function removeClass(c) {
        this.classList.remove(c);
    }

    function toggleClass(c) {
        if (this.classList.contains(c)) {
            this.classList.remove(c);
        } else {
            this.classList.add(c);
        }
    }

    function css(props) {
        var el = this;
        Object.keys(props).forEach(function(prop) {
            el.style[prop] = props[prop];
        });
    }

    function find(s) {
        return $(s, this);
    }

    function data(a, v) {
        a = a || '';
        if (v === undefined) {
            return this.getAttribute('data-' + a);
        } else {
            this.setAttribute('data-' + a, v);
        }
    }

    function on(e, s, f) {
        if (typeof(f) !== 'function') {
            f = s;
            s = null;
        }
        if (s) {
            var orig = this;
            orig.addEventListener(e, function(evt) {
                $(s, orig).forEach(function(el) {
                    if (el === evt.target) {
                        f.call(el, evt);
                    } else if (isChild(evt.target, el)) {
                        f.call(el, evt);
                    }
                });
            });
        } else {
            this.addEventListener(e, f);
        }
    }

    /* ------------- Private Methods -------------- */

    function isChild(el, p) {
        if (!el || !p || !p.childNodes || !p.childNodes.length) {
            return false;
        }
        return ([].slice.call(p.childNodes).filter(function(n) {
            var found = (n === el);
            if (!found && n.childNodes && n.childNodes.length) {
                return isChild(el, n);
            }
            return found;
        })).length;
    }

    function wrap(list) {
        Object.keys(api).forEach(function(f) {
            list[f] = function() {
                var args = arguments;
                var result;
                if (Array.isArray(this)) {
                    result = [];
                    this.forEach(function(root) {
                        var fnResult = api[f].apply(root, [].slice.call(args));
                        if (Array.isArray(fnResult)) {
                            result = result.concat(fnResult);
                        } else if (fnResult !== undefined) {
                            result.push(fnResult);
                        }
                    });

                    if (f === 'find') {
                        wrap(result);
                    } else {
                        result = (result.length && result) || undefined;
                    }
                } else {
                    result = api[f].apply(this, [].slice.call(args));
                }

                return (result === undefined) ? this : result;
            };
        });
        return list;
    }

    window.jkq = $;

})();
