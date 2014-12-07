// WARNING: THIS IS PSEUDO CODE!


$.mockjax({
    url: 'api/search',
    data: { query: 'fhqwhgads' },
    responseText: { results: [] }
});

$.mockjax({

    url: 'api/search',
    method: 'GET',
    response: function(settings) {
        var data = [];

        if (settings.data.query && settings.data.query === 'foobar') {
            // ...
            data.push({
                id: 13,
                name: 'Foobar',
                // ...
            });
        }

        this.status = 200;
        this.responseText = { results: data };
    }

});

$.mockjax({
    url: 'api/search',
    data: { query: 'HTTP-ERROR' },
    status: 500,
    responseText: 'Uh oh...'
});


// Angular $httpBackend

var testApp = angular.module('testApp', ['beerApp', 'ngMockE2E']);

testApp.run(function($httpBackend) {

    $httpBackend.whenGET('/api/search').respond({ results: [] });


    $httpBackend.whenGET('/api/search').respond(function(method, url) {
        var queryParams = customURLToJsonMethod(url);

        if (queryParams.query === 'HTTP-ERROR') {
            
            return [500, 'Uh oh...', {}];

        }
    });

    
    $httpBackend.whenPOST(/api\/rate\/\d+/)
        .respond(function(method, url, data) {
            var beerId = customURLParamExtract(url),
                postData = JSON.parse(data);

            return [200, {
                id: beerId,
                rating: postData.rating,
                avgRating: 3.75
            }, {}];
        });

});


// Jasmine

describe('Toggling favorites', function() {

    beforeEach(function() {
      
        jasmine.Ajax.install();

        // ...

        jasmine.Ajax.stubRequest('api/search?query=fhqwhgads').andReturn({
            status: 500,
            responseText: 'Uh oh...'
        });

        jasmine.Ajax.stubRequest('api/rate/13', 'rating=5').andReturn({
            responseText: JSON.stringify({ id: 13, rating: 5 })
        });

    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

});


// Sinon

var server;
setup(function() {

    server = sinon.fakeServer.create();
    
    server.autoRespond = true;

    // ...
    server.respondWith(
        'GET',
        'api/search',
        [
            200,
            { 'Content-Type': 'application/json' },
            JSON.stringify({ "results": [] })
        ]
    );


    server.respondWith('GET', /api\/rate\/(\d+)/, function(request, beerId) {
        var postData = customPostBodyParser(request.requestBody);

        request.respond(
            200,
            { 'Content-Type': 'application/json' },
            JSON.stringify({
                id: beerId,
                rating: postData.rating,
                avgRating: 3.75
            })
        );
    });


});


breakdown(function() {
    server.restore();
});


