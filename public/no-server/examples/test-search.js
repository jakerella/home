
// -------------------------- //
// WARNING: THIS IS PSEUDO CODE!
// -------------------------- //


beforeEach(function() {

    setupMockAjax({

        url: 'api/search',
        method: 'GET',
        data: { query: 'fhqwhgads' },
        respondWith: { results: [] }

    });

});

afterEach(function() {
    
    destroyAllMocks();

});



test('Searching - no results', function(asyncDone) {

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
        
        asyncDone();
    });

});

test('Searching - one result', function(asyncDone) {

    beerApp.search('foobar', function(results) {
        
        assertNotNull(results);
        assertEqual(results.length, 1);
        assertEqual(results[0].name, 'Foobar');

        // ...
        
        asyncDone();
    });

});

test('Searching - HTTP error', function(asyncDone) {

    beerApp.search('HTTP-ERROR', function(results) {
        
        assertNull(results);
        assertCalled(beerApp.notify);
        
        // ...
        
        asyncDone();
    });

});


// ...