// WARNING: THIS IS PSEUDO CODE!
beforeEach(function() {


    setupMockAjax({

        url: 'api/favorite/13',
        method: 'POST',
        respondWith: { id: 13, isFavorite: false }

    });


    setupMockAjax({

        url: 'api/favorite/7',
        method: 'POST',
        respondWith: { id: 7, isFavorite: true }

    });


});


afterEach(function() {
    
    destroyAllMocks();

});


test('Favorite - no ID', function() {

    beerApp.toggleFavorite();
    assertCalled(beerApp.notify, 1);
    assertCalled($.ajax, 0);

});

test('Favorite - unknown ID', function() {

    beerApp.toggleFavorite(12345, function(id, isFavorite) {
        assertEqual(id, 12345);
        assertEqual(isFavorite, null);
        assertCalled(beerApp.notify, 1);
        // ...
    });

});

test('Favorite - good ID, already favorite', function() {

    beerApp.toggleFavorite(13, function(id, isFavorite) {
        assertEqual(id, 13);
        assertEqual(isFavorite, false);
        assertTrue($('[data-beerid=13]').hasClass('favorite'));
        // Don't do this...
        // assertTrue($('[data-beerid=13]').hasClass('favorite'));
        // Do this...
        assertCalled(beerApp.toggleBeerFavIcon, 1);
        // ...
    });

});

