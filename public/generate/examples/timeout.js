'use strict';


setTimeout(function() {
    console.log('100 ms timeout!');
}, 100);

// Let's assume this takes ~1000 ms
for (let i=0; i<50000000; ++i) {
    let obj = new Object();
}

console.log('Long run complete');
