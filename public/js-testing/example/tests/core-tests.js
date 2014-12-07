
// ---------------- Test Modules --------------- //

module("Initialize & Options", {
    setup: function() {
        // whatever you need to do before THIS MODULE runs
    },
    teardown: function() {
        // whatever you need to do after THIS MODULE runs
    }
});

test("App namespace exists", function() {
    ok(jk, "The 'jk' namespace exists");
    equal(jk.searchCount, 0, "Search count starts at 1");
});

test("Default Settings", function() {
    equal(jk.searchCount, 0, "Search count starts at zero");
    strictEqual(jk.lastSearch, null, "Last search starts as null");
});

