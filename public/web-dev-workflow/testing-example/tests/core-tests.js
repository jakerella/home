/*global QUnit*/

// ---------------- Test Modules --------------- //

QUnit.module("Searching", {
    setup: function() {
        
        // whatever you need to do before THIS MODULE runs
        
    },
    teardown: function() {
        
        // whatever you need to do after THIS MODULE runs
        
    }
});

QUnit.test("Namespace exists", function(assert) {
    
    assert.ok(window.jk, "'jk' namespace exists");
    
    assert.equal(typeof window.jk.initSearch, "function", "initialization function exists");
    
});


