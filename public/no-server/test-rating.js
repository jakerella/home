// WARNING: THIS IS PSEUDO CODE!
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



test('Rating - bad rating value', function() {

    beerApp.rateBrew(13, -23);
    assertCalled(beerApp.notify, 1);
    assertCalled($.ajax, 0);

});

test('Rating - good rating', function() {

    beerApp.rateBrew(13, 5, function(id, rating, average) {
        assertEqual(id, 13);
        assertEqual(rating, 5);
        assertEqual(average, 3.75);
        assertCalled(beerApp.showBeerRating, 1);
        // ...
    });

});
