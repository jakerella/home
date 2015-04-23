
// -------------------------- //
// WARNING: THIS IS PSEUDO CODE!
// -------------------------- //


beforeEach(function() {


    setupMockAjax({

        url: /api\/rate\/(\d+)/,
        method: 'POST',
        respond: function(request) {
            
            return {
                id: request.params[0],
                rating: Number(request.data.rating),
                avgRating: 3.75
            };
        }
        
    });


});


afterEach(function() {
    
    destroyAllMocks();

});



test('Rating - bad rating value', function(asyncDone) {

    beerApp.rateBrew(13, -23);
    assertCalled(beerApp.notify, 1);
    assertCalled($.ajax, 0);

    asyncDone();
});

test('Rating - good rating', function(asyncDone) {

    beerApp.rateBrew(13, 4, function(data) {
        assertEqual(data.id, 13);
        assertEqual(data.rating, 4);
        assertEqual(data.avgRating, 3.5);
        assertCalled(beerApp.showBeerRating);

        // ...
        
        asyncDone();
    });

});
