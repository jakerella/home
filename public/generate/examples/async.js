'use strict';

const fs = require('fs');
const promisify = require('./promisify');
const run = require('./run');


const readFile = promisify(fs.readFile);


/**** Using the denodeified readFile method */

readFile('./data-1.json')
    .then(function(data) {
        console.log('File data!', data.toString());
    })
    .catch(function(err) {
        console.log('error...', err.message);
    });





/**** 3 file reads in a row - still asynchronous */

run(function* readAllFiles() {

  const one = JSON.parse(yield readFile('data-1.json'));
  const more = JSON.parse(yield readFile('data-' + one.nextIndex + '.json'));
  const extra = JSON.parse(yield readFile('data-' + more.nextIndex + '.json'));

  console.log( one, more, extra );

});



/**** Example converted from readfile-sync.js */

run(function* getData() {
    const data = yield readFile('data-1.json');

    data = JSON.parse( data );
    // Do something with the data...
    console.log('Data from file 1', data);

    const moreData = yield readFile('data-' + data.nextIndex + '.json');

    moreData = JSON.parse( moreData );
    console.log('Data from file 2', moreData);

    if (moreData.whatever) {
        const otherData = yield readFile('some-other-data.json');
    }
});




/**** 3 file reads in a row using a while loop with returned data */

run(function* () {
    const nextIndex = 1,
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

    const allData = yield Promise.all([
        readFile('data-1.json'),
        readFile('data-2.json'),
        readFile('data-5.json')
    ]);

    console.log('All data in one yield: ' + allData);
});



/**** Example of error handling with async calls */

run(function* () {
  const data = [];

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
