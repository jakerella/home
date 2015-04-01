'use strict';


setTimeout(function() {
    console.log('1 ms timeout');
}, 1);

function longRun() {
    var obj, end,
        start = (new Date()).getTime();
    
    for (var i=0; i<10000000; ++i) {
        obj = new Object();
    }
    
    end = (new Date()).getTime();
    
    console.log('Long run is complete after ' + (end - start) + 'ms');
}

longRun();

