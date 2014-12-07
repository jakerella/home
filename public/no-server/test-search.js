// WARNING: THIS IS PSEUDO CODE!
beforeEach(function() {


    setupMockAjax({

        url: 'api/search',
        method: 'GET',
        data: { query: 'fhqwhgads' },
        respondWith: { results: [] }

    });


    setupMockAjax({

        url: 'api/search',
        method: 'GET',
        respond: function(request) {
            var data = [];

            if (request.data.query && request.data.query === 'foobar') {
                data.push({
                    id: 13,
                    name: 'Foobar',
                    // ...
                });
            }
            // ...
            if (request.data.query && request.data.query === 'HTTP-ERROR') {
                return { status: 500, response: 'Uh oh...' };
            }

            return { status: 200, response: { results: data } };
        }

    });


});


afterEach(function() {
    
    destroyAllMocks();

});



test('Searching - no results', function() {

    setupMockAjax({
        url: '/api/search',
        method: 'GET',
        data: { query: 'fhqwhgads' },
        respondWith: { results: [] }
    });

    beerApp.search('fhqwhgads', function(results) {
        assertEqual(results, []);
        assertEmpty($('#search-results'));
        // ...
    });

});

test('Searching - one result', function() {

    beerApp.search('foobar', function(results) {
        assertEqual(results.length, 1);
        assertEqual(results[0].name, 'Foobar');
        // ...
    });

});

test('Searching - HTTP error', function() {

    beerApp.search('HTTP-ERROR', function(results) {
        assertEqual(results, null);
        assertCalled(beerApp.notify, 1);
        // ...
    });

});


// ...