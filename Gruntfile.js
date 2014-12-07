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
        }

    });

    // Load NPM Tasks
    require('matchdep').filterDev('grunt-*', grunt.config.get('pkg')).forEach(grunt.loadNpmTasks);

    grunt.registerTask('default', ['jshint']);
};