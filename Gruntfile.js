module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify:     {
			options:{
				transform:  [ require('grunt-react').browserify ]
			},
			app: {
				src: 'public/src/app.js',
				dest: 'public/build/app.js'
			}
		},
		compass: {
			dist: {
				options: {
					basePath:'public/styles/',
					sassDir:'scss',
					cssDir:'css',
					outputStyle:'compressed'
				}
			}
		},
		watch: {
			browserify: {
				files: ['public/src/**/*.js'], 
				tasks: ['browserify'] 
			},
			compass: {
				files: ['public/styles/**/*.scss'], 
				tasks: ['compass']
			}
		}
 
	});
 
	//погружаем все необходимые модули
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify')
	grunt.loadNpmTasks('grunt-contrib-compass')
	//забиваем в задачу по умолчению все наши задачи
	grunt.registerTask('default', ['browserify','compass', 'watch']);
};