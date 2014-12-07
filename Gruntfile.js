/* jshint latedef:false */

module.exports = function ( grunt ) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		meta: {
			banner: '/*! <%= pkg.name %> <%= pkg.version %> - <%= pkg.description %> | Author: <%= pkg.author %>, <%= grunt.template.today("yyyy") %> | License: <%= pkg.license %> */\n'
		},

		concat: {
			dist: {
				options: {
					stripBanners: true,
					banner: '<%= meta.banner %>'
				},
				files: {
					'dist/<%= pkg.name %>.js': ['compiled/<%= pkg.main %>']
				}
			}
		},

		uglify: {
			dist: {
				options: {
					banner: '<%= meta.banner %>'
				},
				files: {
					'dist/<%= pkg.name %>.min.js': ['compiled/<%= pkg.main %>']
				}
			}
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'Release %VERSION%',
				commitFiles: ['-a'],
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: '',
				push: false
			}
		},

		jscs: {
			main: {
				options: {
					config: '.jscsrc'
				},
				files: {
					src: [
						'<%= pkg.main %>',
						'src/**/*.js'
					]
				}
			}
		},

		jshint: {
			main: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: [
					'<%= pkg.main %>',
					'src/**/*.js'
				]
			}
		},

		browserify: {
			options: {
				browserifyOptions: {
					standalone: 'jQuery.kist.loader.loadGmaps'
				}
			},
			standalone: {
				options: {
					plugin: ['bundle-collapser/plugin'],
					preBundleCB: function ( b ) {
						updateBrowserifyShim(true, {
							'kist-loader': 'global:$.kist.loader'
						});
					},
					postBundleCB: function ( err, src, next ) {
						updateBrowserifyShim(false, null, function () {
							next(err, src);
						});
					}
				},
				files: {
					'compiled/<%= pkg.main %>': '<%= pkg.main %>'
				}
			}
		},

		connect: {
			test:{
				options: {
					open: true
				}
			}
		},

		'compile-handlebars': {
			test: {
				templateData: {
					bower: '../../../bower_components',
					compiled: '../../../compiled',
					assets: 'assets'
				},
				partials: 'test/manual/templates/partials/**/*.hbs',
				template: 'test/manual/templates/*.hbs',
				output: 'compiled/test/manual/*.html'
			}
		},

		copy: {
			test: {}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			test: ['watch','connect:test:keepalive']
		},

		watch: {
			hbs: {
				files: 'test/manual/**/*.hbs',
				tasks: ['compile-handlebars:test']
			},
			browserify: {
				files: ['<%= pkg.main %>', 'src/**/*.js'],
				tasks: ['browserify:standalone']
			}
		}

	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('test', function () {
		var tasks = ['compile-handlebars:test','copy:test','browserify:standalone'];
		if ( grunt.option('watch') ) {
			tasks.push('concurrent:test');
		}
		grunt.task.run(tasks);
	});

	grunt.registerTask('stylecheck', ['jshint:main', 'jscs:main']);
	grunt.registerTask('default', ['stylecheck', 'browserify:standalone', 'concat', 'uglify']);
	grunt.registerTask('releasePatch', ['bump-only:patch', 'default', 'bump-commit']);
	grunt.registerTask('releaseMinor', ['bump-only:minor', 'default', 'bump-commit']);
	grunt.registerTask('releaseMajor', ['bump-only:major', 'default', 'bump-commit']);

};

/**
 * @param  {Boolean}   update
 * @param  {Object}   props
 * @param  {Function} cb
 */
function updateBrowserifyShim ( update, props, cb ) {
	props = props || {};
	var file = 'package.json';
	var fs = require('fs');
	var pkg = require('./' + file);

	if ( update ) {
		fs.writeFileSync('./_' + file, fs.readFileSync('./' + file));
		for ( var prop in props ) {
			if ( props.hasOwnProperty(prop) ) {
				pkg['browserify-shim'][prop] = props[prop];
			}
		}
		fs.writeFileSync('./' + file, JSON.stringify(pkg));
	} else {
		fs.writeFileSync('./' + file, fs.readFileSync('./_' + file));
		fs.unlinkSync('./_' + file);
	}

	if ( cb ) {
		cb();
	}
}
