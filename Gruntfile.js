module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                jshintignore: '.jshintignore'
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
        }

    });

    // Load NPM Tasks
    require('matchdep').filterDev('grunt-*', grunt.config.get('pkg')).forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['jshint', 'sass']);
};