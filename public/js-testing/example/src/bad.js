
$(document).ready(function() {
    $("#search-form").on("submit", function(e) {
        
        // ...

        e.preventDefault();

        var query = $("#search-query").val();

        $.ajax({
            // ...
            url: "/api/search",
            data: { "query": query },
            success: function(results) {
                results.forEach(function(item) {
                    
                    // ...
                    
                    $("#search-results")
                        .append("<li> " + item + " </li>");

                });
            },
            error: function() {
                
                // ...
                
                $("#messages")
                    .append("<p class='error'> ... </p>");
            }
        });
    });
});
