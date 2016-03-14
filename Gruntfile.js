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
          'public/index.html'
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
    },
    clean: ['node_modules'],
    auto_install: {
    	local: {
    		options: {
    			bower: false,
    			stdout: false
    		}
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


  grunt.registerTask('build', ['gitpull:run', 'auto_install', 'clean', 'auto_install', 'bower:install', 'wiredep']);
  grunt.registerTask('serve', ['express', 'watch']);
  grunt.registerTask('test', ['clean', 'auto_install', 'bower:install', 'wiredep']);
};
