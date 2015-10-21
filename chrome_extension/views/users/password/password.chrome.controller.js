'use strict';

(function () {

  function passwordController($scope, $stateParams, $http, $state, Authentication) {

    var self = this;
    self.authentication = {};

    self.authentication.user = Authentication.getUser();

    //If user is signed in then redirect back home
    if (self.authentication.user !== null) $state.go('home');

    // Submit forgotten password account id
    self.askForPasswordReset = function() {
      self.success = self.error = null;

      $http.post('http://localhost:3000/auth/forgot', self.credentials)
        .success(function(response) {
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

      $http.post('/auth/reset/' + $stateParams.token, self.passwordDetails)
        .success(function(response) {
          // If successful show success message and clear form
          self.passwordDetails = null;

          // Attach user profile
          Authentication.setUser(response);

          // And redirect to the index page
          $state.go('passwordResetSuccess');
        })
        .error(function(response) {
          self.error = response.message;
      });
    };
  }

  angular.module('drops')
    .controller('passwordController', ['$scope', '$stateParams', '$http', '$state', 'Authentication', passwordController])

}());
