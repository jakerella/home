
// Mockjax settings for ajax faking

var reqGoodSearch = {
  url: '/search',
  type: 'get',
  status: 200,
  dataType: 'json',
  response: function(req) {
    var resp = { "results": ["result one", "result two"] };
    this.responseText = JSON.stringify(resp);
  }
};
var reqBadSearch = {
  url: '/search',
  type: 'get',
  status: 400,
  dataType: 'json',
  response: function(req) {
    this.responseText = "400 Bad request";
  }
};


// ---------------- Test Modules --------------- //

module("Searching");

test("Search module exists", function() {
    ok((typeof jk.initSearch === "function"), "The initSearch method exists");
});

test("Initialize Search", function() {
    strictEqual(jk.initSearch("#foobar"), null, "Bad input to init results in null");
    equal(jk.initSearch("#the-form").length, 1, "Good input returns jQuery wrapped node");
});

test("Handling results", function() {
    var data = {
        results: ["one", "two"]
    };

    expect((2 + data.results.length));

    equal(jk.handleResults(data, "#results"), data.results.length, "Correct return value from handleResults");
    equal($("#results li").length, 2, "Correct number of result elements");
    $("#results li").each(function(i) {
        equal($(this).text(), data.results[i], "Correct text in result element " + i);
    });
});

asyncTest("Successful search", function() {
    $.mockjaxClear();
    $.mockjax(reqGoodSearch);

    var searchTerm = "foobar";
    jk.doSearch(searchTerm, function(data) {
        deepEqual(data, { "results": ["result one", "result two"] }, "The data in the callback is correct");
        equal(jk.searchCount, 1, "Search count is incremented");
        equal(jk.lastSearch, searchTerm, "Last search is correct");
        start();
    });
});

asyncTest("Bad search", function() {
    $.mockjaxClear();
    $.mockjax(reqBadSearch);

    jk.doSearch("foobar", function(data, msg) {
        equal(data, "error", "There was an expected error");
        ok((msg && msg.length), "There was an error message provided");
        start();
    });

});
