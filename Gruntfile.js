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
		watch: {
			browserify: {
				files: ['public/src/**/*.js'], // следить за изменениями любых файлов с разширениями .scss
				tasks: ['browserify'] // и запускать такую задачу при их изменении
			}
		}
 
	});
 
	//погружаем все необходимые модули
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browserify')
	//grunt.loadNpmTasks('grunt-react');
	//забиваем в задачу по умолчению все наши задачи
	grunt.registerTask('default', ['browserify','watch']);
};