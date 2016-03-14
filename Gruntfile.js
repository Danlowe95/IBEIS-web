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
    }
  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['bower:install', 'express', 'watch']);
  grunt.registerTask('test', []);
};
