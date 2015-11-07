'use strict';

(function () {

	function authenticationController($http, $state, Authentication, ENV) {

		var self = this;
		self.authentication = Authentication;
		self.apiEndPoint = ENV.apiEndPoint;

		// If user is signed in then redirect back home
		if (self.authentication.user !== null) $state.go('home');

		self.signup = function() {
			$http.post(ENV.apiEndPoint + '/auth/signup', self.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				Authentication.setUser(response);
				self.authentication.user = Authentication.getUser();

				// And redirect to the index page
				$state.go('home');
			}).error(function(response) {
				self.error = response.message;
			});
		};

		self.signin = function() {
			$http.post(ENV.apiEndPoint + '/auth/signin', self.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				Authentication.setUser(response);
				self.authentication.user = Authentication.getUser();

				// And redirect to the index page
				$state.go('home');
			}).error(function(response) {
				self.error = response.message;
			});
		};
		self.goToAuthProvider = function (name) {
			chrome.tabs.create({"url": ENV.apiEndPoint + '/auth/' + name });
		}
	}

	angular.module('users')
		.controller('authenticationController', ['$http', '$state', 'Authentication', 'ENV', authenticationController])

}());
