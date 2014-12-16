
var jk = (window.jk || {});


// We would put this somewhere else...
$(document).ready( function initPage() {
    
    jk.initSearch("#search-form", "#search-field");

});


jk.initSearch = function( form, input ) {
    var $form = $(form),
        $input = $(input);

    if ( !$form.length || !$input.length ) {
        return null;
    }
    // Audits

    $form.on("submit", function submitHandler(e) {
        e.preventDefault();
        // ...
        jk.doSearch( $input.val() );
    });

    return $form;
};


jk.doSearch = function( query, callback ) {
    if ( !query || !query.length ) {
        jk.showError("Please enter a search query!");
    }

    // Data audits, etc

    callback = (callback || function(){});

    var xhr = $.ajax({
        
        url: "/api/search",
        data: { "query": query },
        dataType: "json",

        success: function successHandler(data) {
            jk.handleResults( data.results );
            callback( data );
        },
        // ...
        
        error: function errorHandler(xhr) {
            callback({ error: xhr.responseText, status: xhr.status });
        }
    });

    return xhr;
};


jk.handleResults = function( results, resultsNode ) {
    var items = [];

    resultsNode = $( resultsNode || "#search-results" );

    results.forEach( function resultLoop( item ) {
        items.push( "<li> " + item + " </li>" );
    });

    return resultsNode.append( items.join("") );
};



jk.showError = function( msg, msgNode ) {
    var $error;

    if (!msg || !msg.length) { return null; }

    msgNode = $( msgNode || "#messages" );

    if ( !msgNode.length ) { return null; }

    console && console.error(msg);
    
    $error = $("<p class='error'>" + msg + "</p>");
    msgNode.append( $error );
    return $error;
};

