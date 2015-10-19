'use strict';

(function () {

	function authenticationController($http, $state, Authentication) {

		var self = this;
		self.authentication = Authentication;

		// If user is signed in then redirect back home
		if (self.authentication.user !== null) $state.go('home');

		self.signup = function() {
			$http.post('http://localhost:3000/auth/signup', self.credentials).success(function(response) {
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
			$http.post('http://localhost:3000/auth/signin', self.credentials).success(function(response) {
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
			chrome.tabs.create({"url": "http://localhost:3000/auth/" + name });
		}
	}

	angular.module('users')
		.controller('authenticationController', ['$http', '$state', 'Authentication', authenticationController])

}());
