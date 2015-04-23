
// -------------------------- //
// WARNING: THIS IS PSEUDO CODE!
// -------------------------- //

var testApp = angular.module('testApp', ['beerApp', 'ngMockE2E']);

testApp.run(function($httpBackend) {

    $httpBackend.whenGET('/api/search').respond({ results: [] });


    $httpBackend.whenGET('/api/search').respond(function(method, url) {
        var queryParams = customURLToJsonMethod(url);

        if (queryParams.query === 'HTTP-ERROR') {
            
            return [500, 'Uh oh...', {}];

        }
    });

    
    $httpBackend.whenPOST(/api\/rate\/\d+$/)
        .respond(function(method, url, data) {
            var beerId = url.split('/')[2],
                postData = JSON.parse(data);

            return [200, {
                id: beerId,
                rating: postData.rating,
                avgRating: 3.5
            }, {}];
        });

});

