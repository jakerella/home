'use strict';


setTimeout(function() {
    console.log('1 ms timeout');
}, 1);

var obj;

// Let's assume this takes ~1000 ms
for (var i=0; i<50000000; ++i) {
    obj = new Object();
}

console.log('Long run complete');
