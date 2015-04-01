'use strict';

var fs = require('fs');
var denodeify = require('./denodeify');
var run = require('./run');


var readFile = denodeify(fs.readFile);


// Simple example using our denodeified readFile method (just to show it works)

readFile('./data-0.json')
    .then(
        function(data) {
            console.log('File data!', data.toString());
        },
        function(err) {
            console.log('error...', err.message);
        }
    );


// Example with "synchronous" processing of multiple file reads

run(function* () {
    var allData = [];
    
    allData.push( yield readFile('data-0.json') );
    allData.push( yield readFile('data-1.json') );
    allData.push( yield readFile('data-2.json') );
    
    console.log('All data:\n' + allData);
    // { "zero": "foo" },{ "one": "bar" },{ "two": "baz" }
});


run(function* () {
    var allData = yield Promise.all([
        readFile('data-0.json'),
        readFile('data-1.json'),
        readFile('data-2.json')
    ]);
        
    console.log('All data in one yield:\n' + allData);
    // { "zero": "foo" },{ "one": "bar" },{ "two": "baz" }
});



// Example of encountering an Error while processing async actions

run(function* () {
    var data = [];
    
    try {
        
        data.push( (yield readFile('data-0.json')).toString() );
        data.push( (yield readFile('data-1.json')).toString() );
        data.push( (yield readFile('data-infinity.json')).toString() );

    } catch(err) {
        console.log(err.code, '::', err.message);
        
        // Notice that we can let this error go...
    }
    
    console.log('Retrieved data:', data);
    
    // We'll still get the data from the first two reads:
    // [ '{ "zero": "foo" }', '{ "one": "bar" }' ]
});

