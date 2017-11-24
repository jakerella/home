
const thePromise = fetch('/api/users', { /* options */ });

fetch('/api/users', { /* options */ })
    .then(function(response) {
        console.log(response.status);

        response.json()
            .then(function(userData) {
                // now we can use the data...
                console.log(userData);
            });

        return response.json();
    })
    .then(function(userData) {
        // now we can use the data...
        console.log(userData);
    })
    .catch(function(err) {
        // handle any error properly!
        console.error('API error:', err);
    });


function apiCall(id, callback) {
    ajaxCall({
        url: '/api/user/' + id,
        success: function(data) {
            callback(null, data);
        },
        error: function(err) {
            callback(err);
        }
    });
}

function apiCall(id) {
    const thePromise = new Promise(function(resolve, reject) {
        ajaxCall({
            url: '/api/user/' + id,
            success: function(data) {
                resolve(data);
            },
            error: function(err) {
                reject(err);
            }
        });
    });

    return thePromise;
}

apiCall(42, function(err, data) {
    if (err) {
        // Handle the error
    }
    console.log(data);
});

apiCall(42)
    .then(function(data) {
        console.log(data);
    })
    .catch(function(err) {
        // Handle the error
    })
