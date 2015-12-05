angular.module('clipto', [
  'envConfig',
  'ui.router',
  'ngResource',
  'ui.bootstrap',
  'ngAnimate',
  'ngMaterial'
]).config([
  '$resourceProvider',
  '$stateProvider',
  '$mdThemingProvider',
  function ($resourceProvider, $stateProvider, $mdThemingProvider) {
    // Don't strip trailing slashes from calculated URLs
    //$resourceProvider.defaults.stripTrailingSlashes = false;
    // material design theme config
    $mdThemingProvider.theme('default').primaryPalette('blue-grey').accentPalette('orange');
    $stateProvider.state('home', {
      templateUrl: 'views/home/home.chrome.view.html',
      controller: 'homeController',
      controllerAs: 'homeCtrl',
      resolve: {
        notes: function (GetNotes) {
          return GetNotes.getNotes();
        },
        activeTabDomain: function (AppState) {
          return AppState.getActiveTabDomain();
        },
        activeTabUrl: function (AppState) {
          return AppState.getActiveTabUrl();
        }
      }
    }).state('home.views', {
      views: {
        'content': { templateUrl: 'views/home/sub_views/home.content.chrome.view.html' },
        'sideBar': { templateUrl: 'views/home/sub_views/home.sideBar.chrome.view.html' },
        'newNote': { templateUrl: 'views/home/sub_views/home.note.chrome.view.html' },
        'settings': { templateUrl: 'views/home/sub_views/home.settings.chrome.view.html' }
      }
    }).state('newNote', {
      templateUrl: 'views/notes/newNote.chrome.view.html',
      controller: 'notesController',
      controllerAs: 'notesCtrl',
      resolve: {
        activeTabUrl: function (AppState) {
          return AppState.getActiveTabUrl();
        },
        activeTabDomain: function (AppState) {
          return AppState.getActiveTabDomain();
        },
        activeNote: function (AppState) {
          return AppState.getActiveNote();
        }
      }
    }).state('signIn', {
      templateUrl: 'views/users/authentication/signIn.chrome.view.html',
      controller: 'authenticationController',
      controllerAs: 'authCtrl'
    }).state('signUp', {
      templateUrl: 'views/users/authentication/signUp.chrome.view.html',
      controller: 'authenticationController',
      controllerAs: 'authCtrl'
    }).state('forgot', {
      templateUrl: 'views/users/password/forgotPassword.chrome.view.html',
      controller: 'passwordController',
      controllerAs: 'passwordCtrl'
    }).state('passwordResetSuccess', {
      templateUrl: 'views/users/password/passwordResetSuccess.chrome.view.html',
      controller: 'passwordController',
      controllerAs: 'passwordCtrl'
    });
  }
]);(function () {
  function AppState() {
    var self = this;
    self.activeTabUrl = '';
    self.activeTabDomain = '';
    self.activeNote = {};
    self.note = {
      title: '',
      content: '',
      tags: []
    };
    return {
      setActiveTabUrl: function (url) {
        self.activeTabUrl = url;
      },
      getActiveTabUrl: function () {
        return self.activeTabUrl;
      },
      setActiveTabDomain: function (domain) {
        self.activeTabDomain = domain;
      },
      getActiveTabDomain: function () {
        return self.activeTabDomain;
      },
      setActiveNote: function (note) {
        self.activeNote = note;
      },
      getActiveNote: function () {
        return self.activeNote;
      },
      initializeNote: function () {
        return self.note;
      }
    };
  }
  angular.module('clipto').factory('AppState', [AppState]);
}());(function () {
  function Authentication() {
    var self = this;
    self.user = null;
    return {
      setUser: function (user) {
        self.user = user;
      },
      removeUser: function () {
        self.user = null;
      },
      getUser: function () {
        return self.user;
      }
    };
  }
  angular.module('clipto').factory('Authentication', [Authentication]);
}());/**
 * This service gets the domainNotes array from the server,
 * generates the url notes array, and returns a promise with both domainNotes and urlNotes
 */
(function () {
  function getNotes($q, Notes, AppState) {
    var self = this;
    self.notes = {
      domainNotes: [],
      urlNotes: []
    };
    function getNotes() {
      var d = $q.defer();
      Notes.getNotes({ domain: AppState.getActiveTabDomain() }, function (response) {
        self.notes.domainNotes = response;
        self.notes.urlNotes = [];
        for (var i = 0; i < response.length; i++) {
          var note = response[i];
          if (note.url == AppState.getActiveTabUrl()) {
            self.notes.urlNotes.push(note);
          }
        }
        d.resolve(self.notes);
      });
      return d.promise;
    }
    return { getNotes: getNotes };
  }
  angular.module('clipto').service('GetNotes', [
    '$q',
    'Notes',
    'AppState',
    getNotes
  ]);
}());(function () {
  function getTags() {
    var self = this;
  }
  angular.module('clipto').factory('GetTags', [getTags]);
}());'use strict';
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
  //Notes service used for communicating with the articles REST endpoints
  angular.module('clipto').factory('Notes', [
    '$resource',
    'ENV',
    notesService
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
  angular.module('clipto').filter('truncate', TruncateFilter);
}());'use strict';
(function () {
  function homeController($q, $scope, $state, Authentication, AppState, Notes, $mdDialog, notes, activeTabDomain, activeTabUrl, ENV) {
    var self = this;
    self.authentication = {};
    self.authentication.user = Authentication.getUser();
    self.activeTabUrl = activeTabUrl;
    self.activeTabDomain = activeTabDomain;
    self.newNote = Object.create(AppState.initializeNote());
    self.editMode = false;
    //self.viewState = viewState;
    self.domainNotes = notes.domainNotes;
    self.urlNotes = notes.urlNotes;
    self.querySearch = querySearch;
    self.apiEndPoint = ENV.apiEndPoint;
    $state.go('home.views');
    // initializing the content to show to be the list of notes
    self.contentToShow = 'content';
    // for switching between list of notes(content), add a new note screen and settings screen
    self.setContentToShow = function (content) {
      self.contentToShow = content;
    };
    self.noteHover = function (note) {
      return note.showHidden = !note.showHidden;
    };
    self.goToPage = function (url) {
      chrome.tabs.create({ url: url });
    };
    self.goHome = function () {
      chrome.tabs.create({ url: ENV.apiEndPoint });
    };
    // -------------- Notes handlers ----------------
    //TODO: move these to a different controller
    self.create = function () {
      var newNote = new Notes({
          url: self.activeTabUrl,
          domain: self.activeTabDomain,
          title: self.newNote.title,
          content: self.newNote.content,
          tags: self.newNote.tags
        });
      newNote.$save(function (response) {
        self.contentToShow = 'content';
        self.domainNotes.unshift(newNote);
        self.urlNotes.unshift(newNote);
        self.newNote = Object.create(AppState.initializeNote());
        $state.go('home.views');  //TODO: create a service that holds the notes for current url and pull it's notes on homeCtrl
      }, function (errorResponse) {
        self.error = errorResponse.data.message;
      });
    };
    self.closeNote = function () {
      if (self.editMode == false) {
        self.newNote = Object.create(AppState.initializeNote());
        //TODO: fix the hack below
        self.newNote.tags = [];
      }
      self.contentToShow = 'content';
      self.editMode = false;
      $state.go('home.views');
    };
    self.editNote = function (note) {
      self.editMode = true;
      self.contentToShow = 'newNote';
      self.activeNote = note;
      self.editedNote = Object.create(note);
      //TODO: fix the hack below
      self.editedNote.tags = note.tags;
      $state.go('home.views');
    };
    self.update = function () {
      self.editedNote.$update(function () {
        self.editMode = false;
        self.contentToShow = 'content';
        self.domainNotes[self.domainNotes.indexOf(self.activeNote)] = self.editedNote;
        self.urlNotes[self.urlNotes.indexOf(self.activeNote)] = self.editedNote;
        $state.go('home.views');
      }, function (errorResponse) {
        self.error = errorResponse.data.message;
      });
    };
    self.showDeleteDialog = function (ev, note) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm().parent(angular.element(document.body)).title('Delete this note?').content('This note will be gone forever.').ariaLabel('Delete').ok('Delete').cancel('Keep it').targetEvent(ev);
      $mdDialog.show(confirm).then(function () {
        self.remove(note);
      }, function () {
        $scope.alert = 'You decided to keep your note.';
      });
    };
    self.remove = function (note) {
      if (note) {
        for (var i in self.domainNotes) {
          if (self.domainNotes[i] === note) {
            self.domainNotes.splice(i, 1);
          }
          if (self.urlNotes[i] && self.urlNotes[i] === note) {
            self.urlNotes.splice(i, 1);
          }
        }
        note.$remove(function () {
          self.contentToShow = 'content';
          $state.go('home.views');
        });
      }
    };
    // ---------------- autocomplete stuff -----------------
    self.userTags = loadTags();
    function querySearch(query) {
      var results = query ? self.userTags.filter(createFilterFor(query)) : self.userTags, deferred;
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
    /**
     * helper function for creating random colors for tags
     * TODO: move this to a service class that holds helper functions
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
    /**
     * called from md-chips directive as md-on-append to transform tag from text to object
     * @param chipText
     * @returns {{text: *, color: string}}
     */
    self.newTagAppend = function (chip) {
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
    // -------------- Settings handlers ----------------
    self.signOut = function () {
    };
  }
  angular.module('clipto').controller('homeController', [
    '$q',
    '$scope',
    '$state',
    'Authentication',
    'AppState',
    'Notes',
    '$mdDialog',
    'notes',
    'activeTabDomain',
    'activeTabUrl',
    'ENV',
    homeController
  ]);
}());(function () {
  function mainController($http, $state, Authentication, AppState, ENV) {
    var self = this;
    self.authentication = {};
    self.activeTabUrl = '';
    chrome.tabs.query({
      'active': true,
      'lastFocusedWindow': true,
      'currentWindow': true
    }, function (tabs) {
      var domain = '';
      var uri = tabs[0].url;
      var domainArray = uri.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1].split('.');
      if (domainArray.length == 2) {
        domain = domainArray.join('.');
      } else {
        domain = domainArray.splice(1).join('.');
      }
      self.activeTabUrl = uri;
      AppState.setActiveTabUrl(uri);
      AppState.setActiveTabDomain(domain);
      $http({
        method: 'get',
        url: ENV.apiEndPoint + '/chromeIndex'
      }).then(function (response) {
        Authentication.setUser(response.data.user);
        self.authentication.user = Authentication.getUser();
      }).then(function () {
        if (self.authentication.user !== null) {
          $state.go('home');
        } else {
          $state.go('signIn');
        }
      });
    });
  }
  angular.module('clipto').controller('mainController', [
    '$http',
    '$state',
    'Authentication',
    'AppState',
    'ENV',
    mainController
  ]);
}());'use strict';
(function () {
  function notesController($stateParams, $state, Authentication, Notes, $q, AppState, activeTabUrl, activeTabDomain, activeNote) {
    var self = this;
    self.authentication = {};
    self.authentication.user = Authentication.getUser();
    self.activeTabUrl = activeTabUrl;
    self.activeTabDomain = activeTabDomain;
    self.activeNote = activeNote;
    self.create = function () {
      //TODO: created and updated fields are generated by Mongo middleware
      var note = new Notes({
          url: self.activeTabUrl,
          domain: self.activeTabDomain,
          title: self.title,
          content: self.content,
          tags: self.tags
        });
      note.$save(function (response) {
        $state.go('home');
        //TODO: create a service that holds the notes for current url and pull it's notes on homeCtrl
        self.title = '';
        self.content = '';
        self.tags = '';
      }, function (errorResponse) {
        self.error = errorResponse.data.message;
      });
    };
    self.update = function () {
      var note = activeNote;
      note.$update(function () {
        $state.go('home');
        AppState.setActiveNote(null);
      }, function (errorResponse) {
        self.error = errorResponse.data.message;
      });
    };
    //self.find = function() {
    //  self.notes = Notes.query();
    //};
    //self.findOne = function() {
    //  self.note = Notes.get({
    //    noteId: $stateParams.noteId
    //  });
    //};
    self.getTags = function (query) {
      var d = $q.defer();
      var matchingTags = self.authentication.user.tags.filter(function (tag) {
          return tag.text.toLowerCase().indexOf(query.toLowerCase()) != -1;
        });
      d.resolve(matchingTags);
      return d.promise;
    };
  }
  angular.module('clipto').controller('notesController', [
    '$stateParams',
    '$state',
    'Authentication',
    'Notes',
    '$q',
    'AppState',
    'activeTabUrl',
    'activeTabDomain',
    'activeNote',
    notesController
  ]);
}());(function () {
  function authenticationController(http, $state, Authentication, ENV) {
    var self = this;
    self.authentication = {};
    self.authentication.user = Authentication.getUser();
    self.apiEndPoint = ENV.apiEndPoint;
    // If user is signed in then redirect back home
    if (self.authentication.user !== null)
      $state.go('home');
    self.signup = function () {
      http.post(self.apiEndPoint + '/auth/signup', self.credentials).success(function (response) {
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
      http.post(self.apiEndPoint + '/auth/signin', self.credentials).success(function (response) {
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
      chrome.tabs.create({ 'url': self.apiEndPoint + '/auth/' + name });
    };
  }
  angular.module('clipto').controller('authenticationController', [
    '$http',
    '$state',
    'Authentication',
    'ENV',
    authenticationController
  ]);
}());'use strict';
(function () {
  function passwordController($stateParams, $http, $state, Authentication, ENV) {
    var self = this;
    self.authentication = {};
    self.authentication.user = Authentication.getUser();
    self.apiEndPoint = ENV.apiEndPoint;
    //If user is signed in then redirect back home
    if (self.authentication.user !== null)
      $state.go('home');
    // Submit forgotten password account id
    self.askForPasswordReset = function () {
      self.success = self.error = null;
      $http.post(self.apiEndPoint + '/auth/forgot', self.credentials).success(function (response) {
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
        Authentication.setUser(response);
        // And redirect to the index page
        $state.go('passwordResetSuccess');
      }).error(function (response) {
        self.error = response.message;
      });
    };
  }
  angular.module('clipto').controller('passwordController', [
    '$stateParams',
    '$http',
    '$state',
    'Authentication',
    'ENV',
    passwordController
  ]);
}());'use strict';
angular.module('envConfig', []).constant('ENV', {
  name: 'production',
  apiEndPoint: 'https://www.clipto.co'
});
;