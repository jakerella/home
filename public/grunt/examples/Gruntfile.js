
module.exports = function (grunt) {
    'use strict';

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
        
        
        clean: ['build'],
        
        
        copy: {
            images: {
                files: [
                    {
                        expand: true,
                        src: ['src/images/*'],
                        src: ['src/images/**'],
                        src: ['**'],
                        src: ['**/*.png'],
                        cwd: 'src/images/',
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
                    'build/js/lib.min.js': ['src/js/vendor/**/*.js'],
                    'build/js/lib.min.js': [
                        'src/js/vendor/jquery/jquery.js',
                        'src/js/vendor/some-plugin/jquery.some-plugin.js'
                    ]
                }
            },
            client: {
                options: {
                    banner: '/* These are my application JS files */'
                },
                files: {
                    'build/js/app.min.js': ['src/js/**/*.js'],
                    'build/js/app.min.js': [
                        'src/js/app.js',
                        'src/js/**/*.js',
                        '!src/js/vendor/**',
                    ]
                }
            }
        },
        
        
        cssmin: {
            build: {
                files: {
                    'build/css/site.min.css': ['src/css/**/*.css']
                }
            }
        },
        
        
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['src/js/vendor/**/*.js']
            },
            client: {
                files: {
                    src: ['src/js/**/*.js']
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
                includePaths: ['app/client/sass']
            },
            main: {
                files: {
                    'public/css/style.css': 'app/client/sass/main.scss'
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
                    cwd: 'src/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build/images'
                }]
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

    grunt.registerTask('default', ['clean', 'copy']);
    
    grunt.registerTask(
        'build',
        ['clean', 'jshint:client', 'sass', 'uglify', 'copy', 'imagemin']
    );
    
    grunt.registerTask('deploy', ['build', 'upload']);
    
    
    
    // Define custom tasks
    
    grunt.registerTask('greet', 'Print a greeting', function() {
        grunt.log.writeln('Hello World!');
    });
    
    grunt.loadTasks('./tasks');
    
    
};
