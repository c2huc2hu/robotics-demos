path = require 'path'

module.exports = (grunt) ->
	grunt.initConfig
		copy:
			main:
				expand: true
				cwd: 'src'
				src: '**.js'
				dest: 'dist/'
			dependencies:
				expand: true
				cwd: 'bower_components/'
				src: '*/dist/**.min.js'
				dest: 'dist/lib/'
				rename: (dest, src) ->
					dest + path.basename(src)
			fastpq:
				cwd: 'bower_components/FastPriorityQueue.js'
				src: 'FastPriorityQueue.js'
				dest: 'dist/'
		jade:
			compile:
				cwd: 'src'
				src:  '**.jade'
				dest: 'dist/'
				ext: '.html'
				expand: true
		connect:
			server:
				options:
					port: 8000
					base: 'dist/'
					keepalive: true

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask 'default', ['copy:main', 'copy:dependencies', 'copy:fastpq', 'jade:compile', 'connect:server']
