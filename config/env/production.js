'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || "mongodb://<drops.extension>:<123qwe!@#QWE>@ds057954.mongolab.com:57954/heroku_7b8f0qw5",
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
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js',
		envConfig: [
			'public/envConfig/envConfig.client.module.js',
			'public/envConfig/production/envConfig.js'
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
		css: 'chrome_extension/dist/application.min.css',
		js: 'chrome_extension/dist/application.min.js',
		envConfig: [
			'chrome_extension/envConfig/production/envConfig.js'
		]
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || '1595678530717040',
		clientSecret: process.env.FACEBOOK_SECRET || '7d128fb928db811cc054279567b38b91',
		callbackURL: 'https://drops-extension.herokuapp.com/auth/facebook/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || '1027337719545-mhr15g5llaamevasrqp4o3ie84a5u0f4.apps.googleusercontent.com',
		clientSecret: process.env.GOOGLE_SECRET || '6iENKMpJElFjDWvPA2FdIp2_',
		callbackURL: 'https://drops-extension.herokuapp.com/auth/google/callback'
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
