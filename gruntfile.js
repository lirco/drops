'use strict';
var _ = require('lodash');

module.exports = function(grunt) {
	// Unified Watch Object
	var watchFiles = {
		serverViews: ['app/views/**/*.*'], 
		serverJS: ['gruntfile.js', 'server.js', 'config/**/*.js', 'app/**/*.js'],
		clientViews: ['public/modules/**/views/**/*.html'],
		clientJS: ['public/js/*.js', 'public/modules/**/*.js'],
		clientCSS: ['public/modules/**/*.css'],
		mochaTests: ['app/tests/**/*.js']
	};

	//grunt.config.set('developmentApiEndPoint', 'http://localhost:3000');
	//grunt.config.set('productionApiEndPoint', 'http://localhost:8000');

	//var developmentApiEndPoint = 'http://localhost:3000';
	//var productionApiEndPoint = 'http://localhost:8000';

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		ngconstant: {
			// Options for all targets
			options: {
				space: '  ',
				wrap: '"use strict";\n\n {%= __ngModule %}',
				name: 'envConfig'
			},
			// Environment targets
			development: {
				options: {
					dest: 'public/envConfig/development/envConfig.js'
				},
				constants: {
					ENV: {
						name: 'development',
						apiEndPoint: '<%= developmentApiEndPoint %>'
					}
				}
			},
			production: {
				options: {
					dest: 'public/envConfig/production/envConfig.js'
				},
				constants: {
					ENV: {
						name: 'production',
						apiEndPoint: '<%= productionApiEndPoint %>'
					}
				}
			},
			chromeDevelopment: {
				options: {
					dest: 'chrome_extension/envConfig/development/envConfig.js'
				},
				constants: {
					ENV: {
						name: 'development',
						apiEndPoint: '<%= developmentApiEndPoint %>'
					}
				}
			},
			chromeProduction: {
				options: {
					dest: 'chrome_extension/envConfig/production/envConfig.js'
				},
				constants: {
					ENV: {
						name: 'production',
						apiEndPoint: '<%= productionApiEndPoint %>'
					}
				}
			}
		},
		watch: {
			serverViews: {
				files: watchFiles.serverViews,
				options: {
					livereload: true
				}
			},
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientViews: {
				files: watchFiles.clientViews,
				options: {
					livereload: true
				}
			},
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			}
		},
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.serverJS),
				options: {
					jshintrc: true
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc',
			},
			all: {
				src: watchFiles.clientCSS
			}
		},
		ngmin: {
			production: {
				files: {
					'public/dist/application.js': '<%= applicationJavaScriptFiles %>'
				}
			},
			chromeProduction: {
				files: {
					'chrome_extension/dist/application.js': '<%= chromeJavaScriptFiles %>'
				}
			}
		},
		uglify: {
			production: {
				options: {
					mangle: false
				},
				files: {
					'public/dist/application.min.js': 'public/dist/application.js'
				}
			},
			chromeProduction: {
				options: {
					mangle: false
				},
				files: {
					'chrome_extension/dist/application.min.js': 'chrome_extension/dist/application.js'
				}
			}
		},
		cssmin: {
			combine: {
				files: {
					'public/dist/application.min.css': '<%= applicationCSSFiles %>',
					'chrome_extension/dist/application.min.css': '<%= chromeCSSFiles %>'
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.serverViews.concat(watchFiles.serverJS)
				}
			}
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1337,
					'web-host': 'localhost',
					'debug-port': 3838,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
		concurrent: {
			default: ['nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true
			}
		},
		env: {
			test: {
				NODE_ENV: 'test'
			}
		},
		mochaTest: {
			src: watchFiles.mochaTests,
			options: {
				reporter: 'spec',
				require: 'server.js'
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		}
	});

	// Load NPM tasks 
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	// A Task for loading the configuration object
	grunt.task.registerTask('loadConfig', 'Task that loads the config into a grunt option.', function() {
		var init = require('./config/init')();
		var config = require('./config/config');
		var productionConfig = require('./config/env/production');

		grunt.config.set('applicationJavaScriptFiles', _.union(config.assets.js,productionConfig.assets.envConfig));
		grunt.config.set('applicationCSSFiles', config.assets.css);

		grunt.config.set('chromeJavaScriptFiles', _.union(config.chromeAssets.js,productionConfig.chromeAssets.envConfig));
		grunt.config.set('chromeCSSFiles', config.chromeAssets.css);

		var developmentApiEndPoint = 'http://localhost:3000';
		var productionApiEndPoint = 'https://drops-extension.herokuapp.com';

		grunt.config.set('developmentApiEndPoint', developmentApiEndPoint);
		grunt.config.set('productionApiEndPoint', productionApiEndPoint);

	});

	// Default task(s).
	grunt.registerTask('default', ['lint', 'concurrent:default']);

	// Debug task.
	grunt.registerTask('debug', ['lint', 'concurrent:debug']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);

	// Build task(s).
	grunt.registerTask('build', ['lint', 'loadConfig', 'envConfig', 'ngmin', 'uglify', 'cssmin']);

	// Test task.
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);

	//Task for generating public ENV Config file(s)
	grunt.registerTask('envConfig', ['loadConfig', 'ngconstant:development', 'ngconstant:production', 'ngconstant:chromeDevelopment', 'ngconstant:chromeProduction']);

};
