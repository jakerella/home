window.beerApp = (function(beer) {
    
    beer.search = function(query, callback) {
        
        $.ajax({
            url: "api/search",
            data: { "query": query },
            dataType: "json",
            success: function searchSuccessHandler(data) {
                beer.handleSearchResults(data.results);
                callback(data.results);
            },
            error: function searchErrorHandler() {
                beer.notify("Sorry, but the search failed!");
                callback(null);
            }
        });
        
    };

    beer.toggleFavorite = function(beerId, callback) {

        $.ajax({
            url: "api/favorite/" + beerId,
            type: "POST",
            dataType: "json",
            success: function favoriteSuccessHandler(data) {
                beer.toggleBeerFavIcon(beerId, data.isFavorite);
                callback(data.id, data.isFavorite);
            },
            // ...
            error: function favoriteErrorHandler() {
                beer.notify("Sorry, but toggling favorites failed!");
                callback(null);
            }
        });

    };

    beer.rateBrew = function(beerId, rating, callback) {

        $.ajax({
            url: "api/rate/" + beerId,
            data: { "rating": rating },
            type: "POST",
            dataType: "json",
            success: function rateSuccessHandler(data) {
                beer.showBeerRating(data.id, data.rating, data.avgRating);
                callback(data);
            },
            // ...
            error: function rateErrorHandler() {
                beer.notify("Sorry, but beer rating failed!");
                callback(null);
            }
        });

    };


    beer.handleSearchResults = function(results) {
        return;  // TODO: implement me!
    };

    beer.notify = function(msg) {
        return;  // TODO: implement me!
    };

    beer.toggleBeerFavIcon = function(beerId, isFavorite) {
        return;  // TODO: implement me!
    };

    return beer;

})(window.beerApp || {});
