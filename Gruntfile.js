/**
 * Many thanks to Shadi Abu Hilal for his demonstration repository:
 * https://github.com/shadiabuhilal/js-code-coverage-example
 * Testing client-side JavaScript is a lot more difficult than
 * testing Node.js applications.
 */
'use strict';

var istanbul = require('browserify-istanbul');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-phantom-istanbul');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        },
        postBundleCB: function(err, buffer, next) {
          var code = grunt.template.process(buffer.toString(), {
            data: grunt.file.readJSON('package.json')
          });
          next(err, code);
        }
      },
      coverage: {
        files: {
          'build/cs.js': 'src/cs.js'
        },
        options: {
          transform: [istanbul]
        }
      }
    },

    clean: {
      tests: ['build', 'coverage']
    },

    mocha: {
      options: {
        run: true,
        reporter: 'Spec',
        coverage: {
          lcovReport: 'coverage',
        }
      },
      test: {
        src: ['test/**/*.html']
      }
    },

    uglify: {
      options: {
        preserveComments: /(?:^!|@(?:license|preserve|cc_on))/
      },
      build: {
        src: 'src/cs.js',
        dest: 'src/cs.min.js'
      }
    }
  });

  grunt.registerTask('default', ['uglify', 'clean', 'browserify:coverage', 'mocha']);
};