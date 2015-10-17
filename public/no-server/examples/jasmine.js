
// -------------------------- //
// WARNING: THIS IS PSEUDO CODE!
// -------------------------- //

describe('Toggling favorites', function() {

    beforeEach(function() {
      
        jasmine.Ajax.install();
        
        // ...
        
        jasmine.Ajax.stubRequest('api/search?query=fhqwhgads')
          .andReturn({
              status: 500,
              responseText: 'Uh oh...'
          });
        
        jasmine.Ajax.stubRequest('api/rate/13', 'rating=5')
          .andReturn({
              responseText: JSON.stringify({ id: 13, rating: 5 })
          });
        
        // ...
        
    });
    
    // ...
    
    afterEach(function() {
        jasmine.Ajax.uninstall();
    });
    
});


describe('Rate beer', function() {
    
    // ...
    
    it("should return the correct data", function() {
        var cb = jasmine.createSpy("callback");
        
        beerApp.rateBrew(13, 4, cb);
        
        var request = jasmine.Ajax.requests.mostRecent();
        var data = {
            id: request.url.split('/')[2],
            rating: 4,
            avgRating: 3.5
        };
        
        request.respondWith({
            status: 200,
            responseText: JSON.stringify(data)
        });
        
        expect(cb).toHaveBeenCalledWith(13, 4, 3.5);
    });
    
});
