module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: true,
                ignores: ['public/js/vendor/**/*.js']
            },
            client: ['public/js/**/*.js'],
            server: ['app/**/*.js']
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
    require('matchdep').filterDev('grunt-*', grunt.config.get('pkg')).forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['jshint', 'sass']);
};
