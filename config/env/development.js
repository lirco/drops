'use strict';

module.exports = {
	db: 'mongodb://localhost/drops-dev',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
				'public/lib/angular-material/angular-material.css'
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/angular-aria/angular-aria.js',
				'public/lib//angular-material/angular-material.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js'
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
		envConfig: [
			'public/envConfig/envConfig.client.module.js',
			'public/envConfig/development/envConfig.js'
		]
	},
	chromeAssets: {
		lib: {
			css: [
				'bower_modules/angular-material/angular-material.min.css',
				'bower_modules/bootstrap/dist/css/bootstrap.min.css',
				'bower_modules/angular/angular-csp.css'
			],
			js: [
				'public/lib/angular/angular.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-bootstrap/ui-bootstrap.min.js',
				'public/lib/ng-tags-input/ng-tags-input.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-aria/angular-aria.min.js',
				'public/lib/angular-material/angular-material.min.js'
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
			// no test for now
		]
	},
	app: {
		title: 'drops - Development Environment'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1595678530717040',
		clientSecret: process.env.FACEBOOK_SECRET || '7d128fb928db811cc054279567b38b91',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '1027337719545-mhr15g5llaamevasrqp4o3ie84a5u0f4.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || '6iENKMpJElFjDWvPA2FdIp2_',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'Drops App',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'drops.extension',
				pass: process.env.MAILER_PASSWORD || '123qwe!@#QWE'

			}
		}
	}
};
