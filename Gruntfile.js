module.exports = function(grunt) {

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
    	cwd: 'public/',
      task: {
        src: [
          'public/app/views/index.html'
        ]
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
    }
  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('build', ['gitpull:run', 'bower:install'])
  grunt.registerTask('develop', ['bower:install', 'express', 'watch']);
  grunt.registerTask('test', ['bower:install']);
};
