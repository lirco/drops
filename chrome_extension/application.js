angular.module('drops', ['ui.router', 'ngResource', 'ui.bootstrap', 'ngTagsInput', 'ngAnimate', 'ngMaterial'])
  .config([

    '$resourceProvider',
    '$stateProvider',
    '$mdThemingProvider',

    function ($resourceProvider, $stateProvider, $mdThemingProvider) {

    // Don't strip trailing slashes from calculated URLs
    //$resourceProvider.defaults.stripTrailingSlashes = false;

    // material design theme config
    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('orange');


    $stateProvider

      .state('home', {
        templateUrl: 'views/home/home.chrome.view.html',
        controller: 'homeController',
        controllerAs: 'homeCtrl',
        resolve: {
          notes: function(GetNotes) {
            return GetNotes.getNotes()
          },
          activeTabDomain: function(AppState) {
            return AppState.getActiveTabDomain()
          },
          activeTabUrl: function(AppState) {
            return AppState.getActiveTabUrl()
          }
        }
      })
      .state('home.views', {
        views: {
          'content': {
            templateUrl: 'views/home/sub_views/home.content.chrome.view.html'
          },
          'sideBar': {
            templateUrl: 'views/home/sub_views/home.sideBar.chrome.view.html'
          },
          'newNote': {
            templateUrl: 'views/home/sub_views/home.note.chrome.view.html'
          },
          'settings': {
            templateUrl: 'views/home/sub_views/home.settings.chrome.view.html'
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
