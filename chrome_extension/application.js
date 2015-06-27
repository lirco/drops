angular.module('drops', ['ui.router', 'ngResource', 'ui.bootstrap', 'ngTagsInput', 'ngAnimate', 'ngMaterial'])
  .config([

    '$resourceProvider',
    '$stateProvider',

    function ($resourceProvider, $stateProvider) {

    // Don't strip trailing slashes from calculated URLs
    //$resourceProvider.defaults.stripTrailingSlashes = false;


    $stateProvider

      .state('home', {
        templateUrl: 'views/home/main.chrome.view.html',
        controller: 'homeController',
        controllerAs: 'homeCtrl',
        resolve: {
          notes: function(GetNotes) {
            return GetNotes.getNotes()
          },
          viewState: function(AppState) {
            return AppState.getViewState()
          }
        }
      })
      .state('newNote', {
        templateUrl: 'views/notes/newNote.chrome.view.html',
        controller: 'notesController',
        controllerAs: 'notesCtrl',
        resolve: {
          activeTabUrl: function(AppState) {
            return AppState.getActiveTabUrl()
          },
          activeTabDomain: function(AppState) {
            return AppState.getActiveTabDomain()
          },
          activeNote: function(AppState) {
            return AppState.getActiveNote()
          }
        }
      })
      .state('editNote', {
        templateUrl: 'views/notes/editNote.chrome.view.html',
        controller: 'notesController',
        controllerAs: 'notesCtrl',
        resolve: {
          activeTabUrl: function(AppState) {
            return AppState.getActiveTabUrl()
          },
          activeTabDomain: function(AppState) {
            return AppState.getActiveTabDomain()
          },
          activeNote: function(AppState) {
            return AppState.getActiveNote()
          }
        }
      })

      //User routes
      .state('signIn', {
        templateUrl: 'views/users/authentication/signIn.chrome.view.html',
        controller: 'authenticationController',
        controllerAs: 'authCtrl'
      })
      .state('signUp', {
        templateUrl: 'views/users/authentication/signUp.chrome.view.html',
        controller: 'authenticationController',
        controllerAs: 'authCtrl'
      })
      .state('forgot', {
        templateUrl: 'views/users/password/forgotPassword.chrome.view.html',
        controller: 'passwordController',
        controllerAs: 'passwordCtrl'
      })
      .state('passwordResetSuccess', {
        templateUrl: 'views/users/password/passwordResetSuccess.chrome.view.html',
        controller: 'passwordController',
        controllerAs: 'passwordCtrl'
      })

}]);
