

module.exports = function(grunt) {
    
    grunt.initConfig({
        
        /* Task configuration... */
        
        qunit: {      /* task name */
            basic: {   /* target name */
                
                options: {
                    urls: [ "tests/core.html" ]
                }
                
            },
            
            /* target name and single option: */
            basic: [ "tests/core.html" ],
            
            search: [ "tests/search.html" ],  /* second target */
            search: [ "tests/search.html", "tests/search-results.html" ],
            search: [ "tests/search/*.html" ]
            
            // ...
        },
        
        
        watch: {
            js: {
                files: [ "src/**/*.js" ],
                tasks: [ "qunit" ]
            },
            
            tests: {
                files: [ "tests/*.html", "tests/*.js" ],
                tasks: [ "qunit" ]
            }
        }
        
        // ...
        
    });
    
    
    // Load the plugins
    // grunt.loadNpmTasks("grunt-task-name");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-watch");
    
    
    // ...
    
    
    // Default task(s)
    grunt.registerTask("default", [ "qunit" ]);
    
};