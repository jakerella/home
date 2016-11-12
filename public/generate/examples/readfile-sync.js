
var fs = require('fs');

function getData() {

  var one = JSON.parse(fs.readFileSync('data-1.json').toString());

  // Do something with the data...
  // data = JSON.parse( data );
  console.log(one);

  var more = JSON.parse(fs.readFileSync('data-' + one.nextIndex + '.json').toString());

  // moreData = JSON.parse( moreData );
  console.log(more);

  if (more.nextIndex) {
    var extra = fs.readFileSync('data-' + extra.nextIndex + '.json');
  }
}

getData();
