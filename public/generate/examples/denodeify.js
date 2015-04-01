'use strict';

// DO NOT USE THIS CODE
// It's only for demonstration purposes and not tested nor complete.
// If you need a function like this, consider the Q library and it's 
// similarly named function:
// https://github.com/kriskowal/q/wiki/API-Reference#qnfbindnodefunc-args

module.exports = function denodeify(nodeStyle) {
    return function promiseStyle() {
        var nodeArgs = [].slice.call(arguments);
        
        return new Promise(function(resolve, reject) {
            nodeArgs.push(function(err, value) {
                if (err) {
                    reject(err);
                } else if (arguments.length > 2) {
                    resolve([].slice.call(arguments).slice(1));
                } else {
                    resolve(value);
                }
            });
            
            nodeStyle.apply(this, nodeArgs);
        });
    };
};