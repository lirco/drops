'use strict';

(function () {

  function HeaderController($scope, $http, $state, Authentication, AppState) {

    var self = this;
    self.authentication = {};
    self.authentication.user = Authentication.getUser();
    self.viewState = AppState.getViewState();

    self.stateChange = function(state) {
      AppState.setViewState(state);
      self.viewState = state;
      $scope.$emit('dropsAppEvent','viewEvent:changeViewState', state);
    };

    self.status = {
      isopen: false
    };

    self.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      self.status.isopen = !self.status.isopen;
    };

    self.signOut = function() {
      $http({
        method:'get',
        url:'http://localhost:3000/auth/signout'
      })
        .then(function(response) {
          Authentication.removeUser();
        })
        .then(function(){
          $state.go('signIn');
        });
    }
  }

  angular.module('drops')
    .controller('HeaderController', ['$scope', '$http', '$state', 'Authentication', 'AppState', HeaderController])

}());
