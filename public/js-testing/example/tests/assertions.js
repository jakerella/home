/*global QUnit*/

QUnit.test("Assertion types", function(assert) {
    
    assert.ok(true, "Yeppers");
    assert.ok(false, "false will always fail an 'ok' assertion");

    assert.ok(123, "Truthy");
    assert.ok({ x: 1, y: 2, /* ... */ }, "Truthy");
    assert.ok(null, "Falsy, so this assertion FAILS!");
    assert.ok("", "Also FAILS!");

    assert.equal(1, "1", "uuh... sure, why not.");
    assert.notEqual(1, 2, "Duh.");
    
    assert.strictEqual(1, "1", "nope nope nope");
    assert.notStrictEquAL(1, "1", "There you go...");

    assert.deepEqual(window, { /* ... */ }, "Please don't do this");
    assert.notDeepEqual({ "bar": "foo" }, { "foo": "bar" }, "No matchy.");
    assert.notDeepEqual([ 1, 2, 3, 5, 7 ], [ 1, 3, 5, 7 ], "No matchy.");

    function Foo(x, y) {
        this.x = x;
        this.y = y;
    }
    Foo.prototype.doStuff = function() { /* ... */ };

    var f = new Foo(1, 2);

    assert.deepEqual(f, { x: 1, y: 2 }, "FAILS!");

    assert.propEqual(f, { x: 1, y: 2 }, "Direct object props match");
    assert.notPropEqual(f, { x: 1 }, "No matchy");


    assert.throws(
        function() {
            // some code that you *expect* to throw an error
            
            jk.doSomeStuff("bad input");  // we expect this to throw an error
        },
        "Woohoo! There was an Error!"
    );


    assert.throws(
        function() {
            // some code that you *expect* to throw an error
            
            jk.doSomeStuff("bad input");  // we expect this to throw an error
        },
        /that is not valid input/i,
        "Woohoo! There was a matching Error!"
    );


    assert.throws(
        function() {
            // some code that you *expect* to throw an error
            
            jk.doSomeStuff("bad input");  // we expect this to throw an error
        },
        InputError,
        "Woohoo! There was an InputError!"
    );

});

