
var fs = require('fs');

function getData() {
    
    var data = fs.readFileSync('data-1.json');

    // Do something with the data...
    data = JSON.parse( data );
    console.log(data);

    var moreData = fs.readFileSync('data-' + data.nextIndex + '.json');

    moreData = JSON.parse( moreData );
    console.log(moreData);

    if (moreData.whatever) {
        var otherData = fs.readFileSync('some-other-data.json');
    }
}

getData();