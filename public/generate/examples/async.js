'use strict';

var fs = require('fs');
var denodeify = require('./denodeify');
var run = require('./run');


var readFile = denodeify(fs.readFile);


/**** Using the denodeified readFile method */

readFile('./data-1.json')
    .then(
        function(data) {
            console.log('File data!', data.toString());
        },
        function(err) {
            console.log('error...', err.message);
        }
    );



/**** 3 file reads in a row */

run(function* () {
    
    console.log( (yield readFile('data-1.json')).toString() );
    
    console.log( (yield readFile('data-2.json')).toString() );
    
    console.log( (yield readFile('data-5.json')).toString() );
    
});



/**** 3 file reads in a row using a while loop with returned data */

run(function* () {
    var nextIndex = 1,
        prevData = null,
        allData = [];
    
    while (nextIndex) {
        
        prevData = yield readFile('data-' + nextIndex + '.json');
        allData.push( prevData );
        nextIndex = prevData.nextIndex;
        
    }
    
    console.log('All data:\n' + allData);
});



/**** Using a single yield statement for the 3 file reads */

run(function* () {
    
    var allData = yield Promise.all([
        readFile('data-1.json'),
        readFile('data-2.json'),
        readFile('data-5.json')
    ]);
        
    console.log('All data in one yield: ' + allData);
});



/**** Example of error handling with async calls */

run(function* () {
    var data = [];
    
    try {
        
        data.push( (yield readFile('data-1.json')).toString() );
        data.push( (yield readFile('data-2.json')).toString() );
        data.push( (yield readFile('data-infinity.json')).toString() );

    } catch(err) {
        console.log('ERROR!', err.message);
        
        // Notice that we can let this error go...
    }
    
    
    // We'll still get the data from the first two reads!
    console.log('Retrieved data:', data);
});

