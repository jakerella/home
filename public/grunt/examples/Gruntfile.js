
module.exports = function (grunt) {
    

    grunt.initConfig({
        
        // task configuration
        
        taskName: {
            options: {
                name: 'value'
            },
            
            targetName: {
                options: {
                    name: 'overridden value'
                },
                
                parameter: 'value'
                
            },
            secondTarget: {
                parameter: 'another value'
            }
        },
        
        
        clean: {
            build: {
                src: ['build']
            }
        },
        
        
        
        copy: {
            images: {
                files: [
                    {
                        expand: true,
                        src: ['app/client/images/*'],
                        src: ['app/client/images/**'],
                        src: ['**'],
                        src: ['**/*.png'],
                        cwd: 'app/client/images/',
                        dest: 'build/images'
                    }
                ]
            }
        },
        
        
        uglify: {
            options: {
                mangle: false
            },
            libs: {
                files: {
                    'build/js/lib.min.js': ['app/client/vendor/**/*.js'],
                    'build/js/lib.min.js': [
                        'app/client/vendor/jquery/jquery.js',
                        'app/client/vendor/some-plugin/jquery.some-plugin.js'
                    ]
                }
            },
            client: {
                options: {
                    banner: '/* These are my application JS files */'
                },
                files: {
                    'build/js/app.min.js': ['app/client/**/*.js'],
                    'build/js/app.min.js': [
                        'app/client/app.js',
                        'app/client/**/*.js',
                        '!app/client/vendor/**',
                    ]
                }
            }
        },
        
        
        cssmin: {
            build: {
                files: {
                    'build/css/site.min.css': ['build/css/**/*.css']
                }
            }
        },
        
        
        jshint: {
            options: {
                eqeqeq: true,
                browser: true,
                ignores: ['app/vendor/**/*.js']
            },
            client: {
                files: {
                    src: ['app/client/**/*.js']
                }
            },
            server: {
                files: {
                    src: ['app/sever/**/*.js']
                }
            }
        },
        
        

        sass: {
            options: {
                includePaths: ['app/client/sass']
            },
            main: {
                files: {
                    'build/css/style.css': 'app/client/sass/main.scss'
                }
            }
        },
        
        
        imagemin: {
            options: {
                optimizationLevel: 5
            },
            all: {
                files: [{
                    expand: true,
                    cwd: 'app/client/images/',
                    src: [ '**/*.{png,jpg,gif}' ],
                    dest: 'build/images/'
                }]
            }
        },


        watch: {
            js: {
                files: ['app/client/**/*.js', 'app/server/**/*.js'],
                tasks: ['jshint']
            },
            sass: {
                files: ['app/client/sass/**/*.scss'],
                tasks: ['sass']
            }
        },


        troll: {
            linux: {
                awesome: true
            },
            mac: {
                awesome: false
            }
        }
        
        // ...
        
    });



    // Load npm modules as tasks
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');


    // Define multi-tasks

    grunt.registerTask('default', ['greet']);

    grunt.registerTask('default', ['jshint']);
    
    grunt.registerTask(
        'build',
        ['clean', 'jshint:client', 'sass', 'uglify', 'imagemin', 'copy']
    );
    
    grunt.registerTask('deploy', ['build', 'upload']);
    
    
    
    // Define custom tasks
    
    grunt.registerTask('greet', 'Print a greeting', function() {
        grunt.log.writeln('Hello World!');
    });
    
    grunt.loadTasks('./tasks');
    
    // ...
};
