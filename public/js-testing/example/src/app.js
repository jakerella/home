
var jk = (window.jk || {});

jk.searchCount = 0;
jk.lastSearch = null;
jk.searchEndpoint = "/search";

jk.initSearch = function initSearch( form ) {
    form = $(form);

    if (!form.length) { return null; }

    form.on("submit", function(e) {
        e.preventDefault();

        jk.doSearch( form.find("input").val() );
    });

    return form;
};

jk.doSearch = function doSearch( query, callback ) {
    if (!query || !query.length) {
        jk.showError("Please enter a search query!");
    }

    callback = (callback || function(){});

    var xhr = $.ajax({
        url: jk.searchEndpoint,
        data: { "query": query },
        dataType: "json",
        success: function(data) {
            jk.handleResults(data);
            callback(data);
        },
        error: function(xhr) {
            callback("error", jk.handleAjaxError(xhr));
        }
    });

    jk.searchCount++;
    jk.lastSearch = query;

    return xhr;
};

jk.handleResults = function handleResults( data, resultsNode ) {
    var i, countAdded = 0;

    if (!data || !data.results) { return null; }

    resultsNode = ( resultsNode || "#search-results" );
    resultsNode = $(resultsNode);

    if (!resultsNode.length) { return null; }

    for (i=0, l=data.results.length; i<l; ++i) {
        resultsNode.append("<li>" + data.results[i] + "</li>");
        countAdded++;
    }

    return countAdded;
};

jk.handleAjaxError = function handleAjaxError(xhr) {
    var msg;

    if (xhr.status === 404) {
        msg = "Sorry, but I couldn't find that resource!";
    } else {
        msg = xhr.responseText;
    }

    return jk.showError(msg);
};

jk.showError = function showError(msg, msgNode) {
    var error;

    if (!msg || !msg.length) { return null; }

    msgNode = ( msgNode || "#messages" );
    msgNode = $(msgNode);

    if (!msgNode.length) { return null; }

    error = $("<p class='error'>" + msg + "</p>");
    msgNode.append(error);
    return error;
};