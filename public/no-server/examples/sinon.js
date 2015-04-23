
// -------------------------- //
// WARNING: THIS IS PSEUDO CODE!
// -------------------------- //

var server;
beforeEach(function() {

    server = sinon.fakeServer.create();
    
    server.autoRespond = true;

    // ...
    
    server.respondWith(
        'GET',
        'api/search?',
        [
            200,
            { 'Content-Type': 'application/json' },
            JSON.stringify({ "results": [] })
        ]
    );


    server.respondWith(
        'POST',
        /api\/rate\/(\d+)/,
        function(request, beerId) {
            var postData = JSON.parse(request.requestBody);

            request.respond(
                200,
                { 'Content-Type': 'application/json' },
                JSON.stringify({
                    id: beerId,
                    rating: postData.rating,
                    avgRating: 3.75
                })
            );
        }
    );


});

afterEach(function() {
    
    server.restore();

});

