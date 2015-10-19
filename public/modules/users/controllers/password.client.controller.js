//'use strict';
//
//angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
//	function($scope, $stateParams, $http, $location, Authentication) {
//		$scope.authentication = Authentication;
//
//		//If user is signed in then redirect back home
//		if ($scope.authentication.user) $location.path('/');
//
//		// Submit forgotten password account id
//		$scope.askForPasswordReset = function() {
//			$scope.success = $scope.error = null;
//
//			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
//				// Show user success message and clear form
//				$scope.credentials = null;
//				$scope.success = response.message;
//
//			}).error(function(response) {
//				// Show user error message and clear form
//				$scope.credentials = null;
//				$scope.error = response.message;
//			});
//		};
//
//		// Change user password
//		$scope.resetUserPassword = function() {
//			$scope.success = $scope.error = null;
//
//			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
//				// If successful show success message and clear form
//				$scope.passwordDetails = null;
//
//				// Attach user profile
//				Authentication.user = response;
//
//				// And redirect to the index page
//				$location.path('/password/reset/success');
//			}).error(function(response) {
//				$scope.error = response.message;
//			});
//		};
//	}
//]);


'use strict';

(function () {

	function passwordController($http, $state, Authentication, $stateParams) {

		var self = this;
		self.authentication = Authentication;

		//If user is signed in then redirect back home
		if (self.authentication.user) $state.go('home');

		// Submit forgotten password account id
		self.askForPasswordReset = function() {
			self.success = self.error = null;
			$http.post('/auth/forgot', self.credentials).success(function(response) {
				// Show user success message and clear form
				self.credentials = null;
				self.success = response.message;
			}).error(function(response) {
				// Show user error message and clear form
				self.credentials = null;
				self.error = response.message;
			});
		};

		// Change user password
		self.resetUserPassword = function() {
			self.success = self.error = null;

			$http.post('/auth/reset/' + $stateParams.token, self.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				self.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$state.go('reset-success');
			}).error(function(response) {
				self.error = response.message;
			});
		};
	}

	angular.module('users')
		.controller('passwordController', ['$http', '$state', 'Authentication', '$stateParams', passwordController])

}());
