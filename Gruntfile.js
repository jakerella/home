module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['public/js/vendor/**/*.js']
            },
            client: {
                files: {
                    src: ['public/js/**/*.js']
                }
            },
            server: {
                files: {
                    src: ['app/**/*.js']
                }
            }
        },

        sass: {
            options: {
                includePaths: ['./app/client/sass']
            },
            main: {
                files: {
                    './public/css/style.css': './app/client/sass/main.scss'
                }
            }
        },

        watch: {
            js: {
                files: ['public/js/**/*.js', 'app/**/*.js'],
                tasks: ['jshint']
            },
            sass: {
                files: ['app/client/sass/**/*.scss'],
                tasks: ['sass']
            }
        }

    });

    // Load NPM Tasks
    require('matchdep').filter('grunt-*', grunt.config.get('pkg')).forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['jshint', 'sass']);
};
