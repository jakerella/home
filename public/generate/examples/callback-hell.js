
var fs = require('fs');

fs.readFile('data-1.json', function(err, data) {
    if (err) {
        // Handle the error somehow
        return;
    }
    
    // Do something with the data...
    data = JSON.parse(data);
    console.log(data);
    
    fs.readFile('data-' + data.nextIndex + '.json', function(err, moreData) {
        if (err) {
            // Handle the error somehow
            return;
        }
        
        moreData = JSON.parse(moreData);
        console.log(moreData);
        
        if (moreData.whatever) {
            fs.readFile('some-other-data.json', function(err, data) {
                
                // ...
                
            });
        } 
    });
});

