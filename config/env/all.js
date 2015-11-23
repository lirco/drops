'use strict';

module.exports = {
	app: {
		title: 'drops',
		description: 'drop your notes anywhere',
		keywords: 'chrome, extension, chrome extension, note, notes, drops, remarks, comments'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'dropsverysecret',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/angular-material/angular-material.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-aria/angular-aria.js',
				'public/lib//angular-material/angular-material.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	},
	chromeAssets: {
		lib: {
			css: [
				'chrome_extension/lib/angular-material/angular-material.min.css',
				'chrome_extension/lib/bootstrap/dist/css/bootstrap.min.css',
				'chrome_extension/lib/angular/angular-csp.css'
			],
			js: [
				'chrome_extension/lib/angular/angular.min.js',
				'chrome_extension/lib/angular-ui-router/release/angular-ui-router.min.js',
				'chrome_extension/lib/angular-resource/angular-resource.js',
				'chrome_extension/lib/angular-bootstrap/ui-bootstrap.min.js',
				'chrome_extension/lib/ng-tags-input/ng-tags-input.min.js',
				'chrome_extension/lib/angular-animate/angular-animate.min.js',
				'chrome_extension/lib/angular-aria/angular-aria.min.js',
				'chrome_extension/lib/angular-material/angular-material.min.js'
			]
		},
		css: [
			'chrome_extension/css/*.css'
		],
		js: [
			'chrome_extension/application.js',
			'chrome_extension/services/*.js',
			'chrome_extension/directives/*.js',
			'chrome_extension/filters/*.js',
			'chrome_extension/material/*.js',
			'chrome_extension/views/*/*.js',
			'chrome_extension/modules/*/*[!tests]*/*.js'
		],
		tests: [
			//not in use
		]
	}
};
