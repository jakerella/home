
module.exports = function(grunt) {    
    'use strict';

    grunt.initConfig({

        // all of our task config

        task: {
            options: {
                param: 'value'
            },
            
            target: {
                param2: true
            },

            target2: {
                options: {
                    param: 'other value'
                }
                param2: false
            }

        }



        troll: {
            linux: {
                awesome: true
            },
            mac: {
                awesome: false
            }
        }


    });


    // include each task module

    grunt.loadNpmTasks('grunt-contrib-jshint');


    // define multi-task aliases 

    grunt.registerTask('default', ['jshint', 'sass']);


    // define custom tasks (maybe in a separate file?)


}
