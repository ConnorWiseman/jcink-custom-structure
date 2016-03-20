module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                preserveComments: /(?:^!|@(?:license|preserve|cc_on))/
            },
            build: {
                src: 'src/cs.js',
                dest: 'build/cs.min.js'
            }
        },
        mocha_phantomjs: {
            options: {
                reporter: 'json-cov',
                output: 'tests/results/result.jcov'
            },
            all: ['tests/**/*.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-phantomjs');

    grunt.registerTask('default', ['uglify', 'mocha_phantomjs']);
};