'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'drops';
    var applicationModuleVendorDependencies = [
        'envConfig',
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
        'ngMaterial'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('material');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
(function () {
  function homeController(Authentication, Notes, $mdDialog, $scope, $q) {
    var self = this;
    var selectedTags = [];
    self.authentication = Authentication.getUser();
    self.notes = Notes.query();
    self.userTags = self.authentication.user.tags;
    self.sortOrder = ['-modified'];
    self.remove = function (note) {
      if (note) {
        note.$remove();
        for (var i in self.notes) {
          if (self.notes[i] === note) {
            self.notes.splice(i, 1);
          }
        }
      } else {
        self.note.$remove(function () {
          $state.go('home');
        });
      }
    };
    //helper function for finding objects in array
    var objIndexOf = function (arr, prop, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === val) {
          return 1;
        }
      }
      return -1;
    };
    self.click = function (tag) {
      var index = -1;
      for (var i = 0; i < selectedTags.length; i++) {
        if (selectedTags[i] === tag) {
          index = i;
          break;
        }
      }
      if (index === -1) {
        selectedTags.push(tag);
        // filter the notes on view by tag selected
        //TODO: option to show tags of multiple tags selected
        self.byTagsFilter = function (note) {
          return objIndexOf(note.tags, 'text', tag.text) !== -1;
        };
      } else {
        selectedTags.splice(index, 1);
      }
    };
    self.showAll = function () {
      self.byTagsFilter = function (note) {
        return self.userTags;
      };
    };
    self.noteHover = function (note) {
      return note.showHidden = !note.showHidden;
    };
    self.showDeleteDialog = function (ev, note) {
      var confirm = $mdDialog.confirm().parent(angular.element(document.body)).title('Delete this note?').content('This note will be gone forever.').ariaLabel('Delete').ok('Delete').cancel('Keep it').targetEvent(ev);
      $mdDialog.show(confirm).then(function () {
        self.remove(note);
      }, function () {
        $scope.alert = 'You decided to keep your note.';
      });
    };
    self.showNote = function ($event, note) {
      $mdDialog.show({
        parent: angular.element(document.body),
        targetEvent: $event,
        templateUrl: 'modules/core/views/note.client.view.html',
        locals: { note: note },
        controller: noteCtrl
      });
      //note dialog controller
      function noteCtrl($scope, $mdDialog, note) {
        $scope.note = note;
        $scope.userTags = loadTags();
        $scope.querySearch = querySearch;
        function querySearch(query) {
          var results = query ? $scope.userTags.filter(createFilterFor(query)) : $scope.userTags, deferred;
          deferred = $q.defer();
          deferred.resolve(results);
          return deferred.promise;
        }
        function createFilterFor(query) {
          var lowercaseQuery = angular.lowercase(query);
          return function filterFn(tag) {
            return tag.textToLower.indexOf(lowercaseQuery) === 0;
          };
        }
        function loadTags() {
          var allTags = self.authentication.user.tags;
          return allTags.map(function (tag) {
            return {
              textToLower: tag.text.toLowerCase(),
              text: tag.text,
              color: tag.color
            };
          });
        }
        $scope.newTagAppend = function (chip) {
          if (chip.color) {
            return {
              text: chip.text,
              color: chip.color
            };
          } else {
            return {
              text: chip,
              color: getRandomColor()
            };
          }
        };
        function getRandomColor() {
          var letters = '0123456789ABCDEF'.split('');
          var color = '#';
          for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        }
        $scope.closeNote = function () {
          $mdDialog.hide();
        };
        $scope.updateNote = function () {
          note.$update(function () {
            $mdDialog.hide();
          }, function (errorResponse) {
            self.error = errorResponse.data.message;
          });
        };
      }
    };
  }
  angular.module('core').controller('homeController', [
    'Authentication',
    'Notes',
    '$mdDialog',
    '$scope',
    '$q',
    homeController
  ]);
}());(function () {
  function sidebarController(scope) {
    var self = this;
  }
  angular.module('drops').controller('sidebarController', [
    '$scope',
    sidebarController
  ]);
}());(function () {
  function TruncateFilter() {
    return function (input, limit) {
      if (limit <= 0) {
        return '';
      }
      if (input) {
        var inputWords = input.split(/\s+/);
        if (inputWords.length > limit) {
          input = inputWords.slice(0, limit).join(' ') + '...';
        }
      }
      return input;
    };
  }
  angular.module('drops').filter('truncate', TruncateFilter);
}());(function () {
  function AppState(Authentication) {
    var self = this;
    self.userTags = Authentication.user.tags;
    self.chosenTags = [];
    return {
      setChosenTags: function (tag) {
      }
    };
  }
  angular.module('core').controller('AppState', [
    'Authentication',
    AppState
  ]);
}());(function () {
  function LircoTools() {
    // ***********************************
    // -------- PUBLIC METHODS -----------
    // ***********************************
    var self = this;
    self.hexToRGB = hexToRGB();
    self.setTextColor = setTextColor();
    self.setTextColor = getRandomColor();
    // ***********************************
    // -------- PRIVET METHODS -----------
    // ***********************************
    /**
     * helper function to convert hex color to rgb
     * @param hex
     * @returns {*}
     */
    function hexToRGB(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ] : null;
    }
    /**
     * determine the text color by it's background color
     * @param bg
     * @returns {*}
     */
    function setTextColor(bg) {
      var rgb = self.hexToRGB(bg);
      var o = Math.round((parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000);
      if (o > 125) {
        return 'black';
      } else {
        return 'white';
      }
    }
    /**
     * generates random color
     * @returns {string}
     */
    function getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  }
  angular.module('core').service('LircoTools', [LircoTools]);
}());'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);//(function () {
//
//  function notesManager(Notes) {
//
//    var self = this;
//    self.notes = Notes.query();
//
//    console.log('***************************************');
//    console.log(notes);
//    console.log('***************************************');
//  }
//
//  angular.module('core')
//    .service('notesManager', ['Notes', notesManager])
//
//}());
'use strict';
(function () {
  function notesService($resource, ENV) {
    return $resource(ENV.apiEndPoint + '/notes/:noteId', { noteId: '@_id' }, {
      update: { method: 'PUT' },
      getNotes: {
        method: 'GET',
        isArray: true
      }
    });
  }
  //Articles service used for communicating with the articles REST endpoints
  angular.module('core').factory('Notes', [
    '$resource',
    'ENV',
    notesService
  ]);
}());'use strict';
// Config HTTP Error Handling
angular.module('material').config([
  '$mdThemingProvider',
  '$mdIconProvider',
  function ($mdThemingProvider, $mdIconProvider) {
    //$mdIconProvider
    //	.defaultIconSet("./assets/svg/avatars.svg", 128)
    //	.icon("menu"       , "./assets/svg/menu.svg"        , 24)
    //	.icon("share"      , "./assets/svg/share.svg"       , 24)
    //	.icon("google_plus", "./assets/svg/google_plus.svg" , 512)
    //	.icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
    //	.icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
    //	.icon("phone"      , "./assets/svg/phone.svg"       , 512);
    $mdThemingProvider.theme('default').primaryPalette('blue-grey').accentPalette('orange');
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html',
      controller: 'passwordController',
      controllerAs: 'passwordCtrl'
    }).state('signIn', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html',
      controller: 'authenticationController',
      controllerAs: 'authCtrl'
    }).state('signUp', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html',
      controller: 'authenticationController',
      controllerAs: 'authCtrl'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html',
      controller: 'passwordController',
      controllerAs: 'passwordCtrl'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html',
      controller: 'passwordController',
      controllerAs: 'passwordCtrl'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html',
      controller: 'passwordController',
      controllerAs: 'passwordCtrl'
    });
    ;
  }
]);'use strict';
(function () {
  function authenticationController($http, $state, Authentication, ENV) {
    var self = this;
    self.authentication = Authentication;
    self.apiEndPoint = ENV.apiEndPoint;
    // If user is signed in then redirect back home
    if (self.authentication.user !== null)
      $state.go('home');
    self.signup = function () {
      $http.post(ENV.apiEndPoint + '/auth/signup', self.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        Authentication.setUser(response);
        self.authentication.user = Authentication.getUser();
        // And redirect to the index page
        $state.go('home');
      }).error(function (response) {
        self.error = response.message;
      });
    };
    self.signin = function () {
      $http.post(ENV.apiEndPoint + '/auth/signin', self.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        Authentication.setUser(response);
        self.authentication.user = Authentication.getUser();
        // And redirect to the index page
        $state.go('home');
      }).error(function (response) {
        self.error = response.message;
      });
    };
    self.goToAuthProvider = function (name) {
      chrome.tabs.create({ 'url': ENV.apiEndPoint + '/auth/' + name });
    };
  }
  angular.module('users').controller('authenticationController', [
    '$http',
    '$state',
    'Authentication',
    'ENV',
    authenticationController
  ]);
}());'use strict';
(function () {
  function passwordController($http, $state, Authentication, $stateParams) {
    var self = this;
    self.authentication = Authentication;
    //If user is signed in then redirect back home
    if (self.authentication.user)
      $state.go('home');
    // Submit forgotten password account id
    self.askForPasswordReset = function () {
      self.success = self.error = null;
      $http.post('/auth/forgot', self.credentials).success(function (response) {
        // Show user success message and clear form
        self.credentials = null;
        self.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        self.credentials = null;
        self.error = response.message;
      });
    };
    // Change user password
    self.resetUserPassword = function () {
      self.success = self.error = null;
      $http.post('/auth/reset/' + $stateParams.token, self.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        self.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $state.go('reset-success');
      }).error(function (response) {
        self.error = response.message;
      });
    };
  }
  angular.module('users').controller('passwordController', [
    '$http',
    '$state',
    'Authentication',
    '$stateParams',
    passwordController
  ]);
}());'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
(function () {
  function Authentication() {
    var self = this;
    self.user = window.user;
    return {
      setUser: function (user) {
        self.user = user;
      },
      removeUser: function () {
        self.user = null;
      },
      getUser: function () {
        return { user: self.user };
      }
    };
  }
  angular.module('users').factory('Authentication', [Authentication]);
}());'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('envConfig');'use strict';
angular.module('envConfig', []).constant('ENV', {
  name: 'production',
  apiEndPoint: 'http://localhost:8000'
});
;