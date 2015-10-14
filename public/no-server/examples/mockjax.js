
// -------------------------- //
// WARNING: THIS IS PSEUDO CODE!
// -------------------------- //
beforeEach(function() {
    $.mockjax({
        url: 'api/search',
        data: { query: 'fhqwhgads' },
        responseText: { results: [] }
    });
});


$.mockjax({
    // ...
    url: 'api/search',
    method: 'GET',
    response: function(req) {
        var data = [];

        if (req.data.query && req.data.query === 'foobar') {
            
            data.push({
                id: 13,
                name: 'Foobar',
                // ...
            });

        } else if (req.data.query && req.data.query === 'lots') {

            for (var i=0; i<100; ++i) {
                data.push({ /* ... */ });
            }

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



$.mockjax({

    url: /api\/favorite\/\d+$/,
    method: 'POST',
    response: function(settings) {
        var id = settings.url.split('/')[2],
            data = {
                'id': id,
                'isFavorite': true
            };

        this.status = 200;

        if (id === 13) {
            
            data.isFavorite = false;

        } else if (id === 27) {
            
            this.status = 500;
            data = 'Oh noes!';

        }
        // ...

        this.responseText = data;
    }

});



$.mockjax({

    url: /api\/rate\/\d+$/,
    method: 'POST',
    response: function(settings, done) {
        var mock = this;

        someCustomAsyncService(settings, function(data) {
            // ...
            
            mock.status = 200;
            mock.responseText = data;
            done();

        });

    }

});



$.mockjax({
    url: 'api/search',
    data: { query: 'foobar' },
    responseTime: 1200,
    headers: {
        'X-User-Token': '12345abcde'
    },
    responseText: { results: [ { id: 13, name: 'Foobar' } ] }
});



$.mockjax({
    url: 'api/favorite/1337',
    responseTime: 2000,
    isTimeout: true
});




$.mockjax({
    url: 'api/user/13',
    proxy: 'mocks/user-13.json'
});



$.mockjax(function(settings) {

    var user = settings.url.match(/api\/user\/(\d+)$/);
    
    if ( user ) {
        return {
            proxy: 'mocks/user-' + user[1] + '.json'
        };
    }
  
    // If you get here, there was no url match
});



$.mockjax(function( requestSettings ) {
   // Here is our manual URL matching...
   if ( /api\/rate\/\d+$/.test(requestSettings.url) ) {

      // We have a match, so we return a response callback...

      return {
         response: function( handlerSettings ) {

            // Now we can check request headers, which may be set directly 
            // on the xhr object through an ajaxSetup() call or otherwise:

            if ( handlerSettings.headers['Authentication'] === 'xyz123' ) {

               this.responseText = { id: 13, rating: 4, avgRating: 3.5 };

            } else {

               this.status = 403;
               this.responseText = "You are not authorized";

            }
         }
      };
   }

    // If you get here, there was no url match
});


afterEach(function() {
    
    $.mockjax.clear();

});


test('clear individual mock', function() {

    var id = $.mockjax({ /* ... */ });

    // do some stuff...

    $.mockjax.clear(id);

    // do more stuff?

});
