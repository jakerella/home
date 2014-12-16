/*global QUnit*/


// ---------------- Test Modules --------------- //

var jk = window.jk;

QUnit.module('Searching', {

    setup: function() {
        
        /* Stuff to do before each test in THIS module */
        
        $.mockjax({
            url: '/api/search',
            data: { query: 'foobar' },
            dataType: 'json',
            responseText: { 'results': ['result one', 'result two'] }
        });
        
        $.mockjax({
            url: '/api/search',
            data: { query: 'http-error' },
            dataType: 'json',
            status: 400,
            responseText: '400 Bad request'
        });
        
    },
    
    
    
    teardown: function() {
        
        /* Stuff to do after each test in THIS module */
        
        $.mockjax.clear();  // remove all mocks after each test
        
    }
    
    
});



QUnit.test("Search module exists", function(assert) {
    assert.equal( typeof jk.initSearch, "function", "The initSearch method exists" );
});


QUnit.test("Initialize Search - bad input", function(assert) {
    
    assert.strictEqual( jk.initSearch(), null, "No input to init results in null" );
    assert.strictEqual( jk.initSearch("#foobar"),           null, "Bad form to init results in null" );
    assert.strictEqual( jk.initSearch("#the-form", "#foo"), null, "Bad input to init results in null" );
    assert.strictEqual( jk.initSearch("#the-form", null),   null, "Null input to init results in null" );
    assert.strictEqual( jk.initSearch(null, "#query"),      null, "Null form to init results in null" );

});


QUnit.test("Initialize Search - good input", function(assert) {
    
    var result = jk.initSearch("#the-form", "#query");

    assert.ok( result && result.jquery, "A jQuery object was returned" );
    assert.equal( result.length, 1, "There is only 1 result in the set" );

    var events = $._data($("#the-form")[0], "events");

    assert.equal( events.submit[0].handler.name, "submitHandler", "Correct submit handler attached" );

});

QUnit.test("Handling results - zero", function(assert) {
    
    var result = jk.handleResults( [], "#results" );

    assert.ok( result && result.jquery, "A jQuery object was returned" );
    assert.equal( result.find("li").length, 0, "Correct number of result elements" );
    
});

QUnit.test("Handling results - two", function(assert) {
    
    var results = ["result one", "result two"];

    assert.expect( 2 + results.length );

    var node = jk.handleResults( results, "#results" );

    assert.ok( node && node.jquery, "A jQuery object was returned" );
    assert.equal( node.find("li").length, results.length, "Correct number of result elements" );

    node.find("li").each(function(i) {
        
        assert.equal($(this).text().trim(), results[i], "Correct text in result element " + i);

    });

});


QUnit.test("Successful search", function(assert) {
    
    var done = assert.async();

    QUnit.expect(1);

    jk.doSearch("foobar", function(data) {
        
        assert.deepEqual(data, { "results": ["result one", "result two"] }, "data is correct");
        
        // Other assertions...
        // For example, assert that the jk.handleResults() method was called!

        // Tell QUnit we're done with async actions
        done();
    });

});


QUnit.test("Bad search", function(assert) {
    
    var done = assert.async(),
        expected = { error: "400 Bad request", status: 400 };

    jk.doSearch("http-error", function(data) {

        assert.equal(data.error, expected.error, "There was an expected error message");
        assert.deepEqual(data, expected, "There was an expected error object");
        assert.propEqual(data, expected, "There were expected error properties");

        // Other assertions...
        // For example, assert that the jk.handleResults() method was NOT called
        // and that jk.showError() WAS called!
        
        // Tell QUnit we're done with async actions
        done();
    });

});

