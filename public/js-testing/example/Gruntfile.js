module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        qunit: {
            core: {
                options: {
                    urls: [ "tests/core.html" ]
                }
            },
            
            basic: [ "tests/core.html" ],

            search: [ "tests/search.html" ],
            search: [ "tests/search.html", "tests/search-results.html" ],
            search: [ "tests/search/*.html" ]
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

    });

    // Load the plugins
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // Default task(s).
    grunt.registerTask("default", [ "qunit" ]);

};