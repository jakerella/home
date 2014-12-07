module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        qunit: {
            core: {
                options: {
                    urls: [ "tests/core.html" ]
                }
            },
            search: {
                options: {
                    urls: [ "tests/search.html" ]
                }
            }
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