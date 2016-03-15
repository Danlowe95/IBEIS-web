module.exports = function(grunt) {
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      install: {
        options: {
          targetDir: 'public/bower_components',
          layout: 'byType',
          install: true,
          verbose: false,
          copy: false,
          cleanTargetDir: true,
          cleanBowerDir: false,
          bowerOptions: {
            forceLatest: true
          }
        }
      }
    },
    wiredep: {
      build: {
        src: 'public/index.html'
      },
      test: {
        src: 'karma.conf.js'
      }
    },
    express: {
      options: {
        script: 'server.js'
      },
      defaults: {}
    },
    watch: {
      files: ['public/bower_components/*', 'bower.json'],
      tasks: ['wiredep', 'express:defaults'],
      options: {
        livereload: true,
        spawn: false
      }
    },
    gitpull: {
      run: {
        options: {
          verbose: true
        }
      }
    },
    clean: ['node_modules'],
    auto_install: {
      local: {
        options: {
          bower: false,
          stdout: false
        }
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-auto-install');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('build', ['gitpull:run', 'auto_install', 'clean', 'auto_install', 'bower:install', 'wiredep:build']);
  grunt.registerTask('develop', ['clean', 'auto_install', 'bower:install', 'wiredep']);
  grunt.registerTask('serve', ['express', 'watch']);
  grunt.registerTask('test', function(target, option) {
    if (target === 'travis') {
      return grunt.task.run([
        'bower:install',
        'wiredep',
        'karma'
      ]);
    }
    if (target === 'build') {
      return grunt.task.run([
        'clean',
        'auto_install',
        'bower:install',
        'wiredep',
        'karma'
      ]);
    } else {
      return grunt.task.run(['karma'])
    }
  });
};
