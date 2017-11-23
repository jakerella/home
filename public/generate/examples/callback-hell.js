
const fs = require('fs');

fs.readFile('data-1.json', function(err, one) {
    if (err) {
        // Handle the error somehow
        return;
    }

    // Do something with the data...
    one = JSON.parse(one.toString());
    console.log(one);

    fs.readFile('data-' + one.nextIndex + '.json', function(err, more) {
        if (err) {
            // Handle the error somehow
            return;
        }

        more = JSON.parse(more);
        console.log(more);

        if (more.nextIndex) {
            fs.readFile('data-' + more.nextIndex + '.json', function(err, extra) {

                // ...

            });
        }
    });
});
