module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        vendor: grunt.file.readJSON('.bowerrc').directory,

        assemble: {
            options: {
                flatten: false,
                helpers: ['src/helpers/*.js'],
                data: ['src/data/*.json'],
                partials: ['src/includes/**/*.{html,less,hbs,md}'],
                layoutdir: 'src/layouts',
                collections: [{
                    title: 'tags',
                    name: 'components',
                    sortorder: 'desc'
                }],
            },
            pages: {
                expand: true,
                flatten: true,
                cwd: 'src/pages',
                src: '**/*.hbs',
                dest: 'build'
            }
        },

        webfont: {
            icons: {
                src: 'src/assets/svg-icons/*.svg',
                dest: 'src/less/icons-font/',
                destCss: 'src/less/icons-font/',
                options: {
                    hashes: false,
                    types: 'woff',
                    ligatures: false,
                    fontHeight: 1000,
                    descent: 100,
                    ascent: 900,
                    syntax: 'bootstrap',
                    stylesheet: 'less',
                    relativeFontPath: '../assets/fonts',
                    destHtml: 'src/includes/',
                    htmlDemoTemplate: 'src/assets/svg-icons/graphics.icons.base.template.html',
                    font: 'stylebox-icons',
                    embed: true

                }
            }
        },

        less: {
            dist: {
                options: {
                    paths: ['less'],
                    sourceMap: true,
                    cleancss: false,
                    banner: 'test'
                },
                files: {
                    'build/css/style-v<%= pkg.version %>.min.css': 'src/less/main.less'
                }
            }
        },

        copy: {
            tests: {
                files: [{
                    expand: true,
                    cwd: 'src/assets/fonts',
                    src: '**/*',
                    dest: 'build/assets/fonts/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'src/assets/icons-font',
                    src: '**/*.woff',
                    dest: 'build/assets/fonts/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'src/assets/',
                    src: '**/*.{png,jpg,gif,svg}',
                    dest: 'build/assets/images',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'src/assets/',
                    src: '**/*.js',
                    dest: 'build/assets/js',
                    filter: 'isFile'
                }]
            }
        },

        clean: ['build/'],

        connect: {
            server: {
                options: {
                    port: 9002,
                    base: 'build/'
                }
            }
        },
        bump: {
            options: {
                files: ['*.json', 'src/data/index.json'],
                commit: true,
                commitMessage: 'v%VERSION%',
                commitFiles: ['*.json', 'src/data/index.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin master',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        },

        'ftp-deploy': {
            build: {
                auth: {
                    host: 'ftp.cssberries.com',
                    port: 21,
                    authKey: 'key1'
                },
                src: 'build',
                dest: 'public_html/cssberries.com',
            }
        },
        watch: {
            options: {
                interrupt: true,
                debounceDelay: 0,
                interval: 0,
                livereload: true,
                spawn: true,
            },
            less: {
                files: ['src/less/**/*'],
                tasks: [
                    'less'
                ],
            },
            assemble: {
                files: ['src/**/*'],
                tasks: [
                    'assemble'
                ],
            }
        }
    });

    grunt.loadNpmTasks('assemble');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-ftp-deploy');

    grunt.task.registerTask('watch_start');
    grunt.registerTask('build:assets', ['clean', 'less', 'copy']);
    grunt.registerTask('build', ['build:assets', 'assemble']);
    grunt.registerTask('develop', ['travis', 'watch_start']);
    grunt.registerTask('default', ['build', 'connect:server', 'watch']);
    grunt.registerTask('server', ['connect:server:keepalive']);
};
