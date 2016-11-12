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



/**** 3 file reads in a row - still asynchronous */

run(function* readAllFiles() {

  var one = JSON.parse(yield readFile('data-1.json'));
  var more = JSON.parse(yield readFile('data-' + one.nextIndex + '.json'));
  var extra = JSON.parse(yield readFile('data-' + more.nextIndex + '.json'));

  console.log( one, more, extra );

});



/**** Example converted from readfile-sync.js */

run(function* getData() {
    var data = yield readFile('data-1.json');

    data = JSON.parse( data );
    // Do something with the data...
    console.log('Data from file 1', data);

    var moreData = yield readFile('data-' + data.nextIndex + '.json');

    moreData = JSON.parse( moreData );
    console.log('Data from file 2', moreData);

    if (moreData.whatever) {
        var otherData = yield readFile('some-other-data.json');
    }
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

    data.push( JSON.parse(yield readFile('data-1.json')) );
    data.push( JSON.parse(yield readFile('data-' + one.nextIndex + '.json')) );
    data.push( JSON.parse(yield readFile('data-infinity.json')) );

  } catch(err) {
      console.log('ERROR!', err.message);

      // Notice that we can let this error go...
  }


  // We'll still get the data from the first two reads!
  console.log('Retrieved data:', data);
});
