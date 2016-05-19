'use strict';

(function () {

  function homeController($q, $scope, $state, Authentication, AppState, Notes, $mdDialog, notes, activeTabDomain, activeTabUrl, ENV, $window) {

    //****************************************************************//
    //******************** VARIABLES *********************************//
    //****************************************************************//


    //****************************************************************//
    //******************** GLOBALS ***********************************//
    //****************************************************************//

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

    // initializing the content to show to be the list of notes
    self.contentToShow = "content";

    self.create = function() {
      var newNote = new Notes({
        url: self.activeTabUrl,
        domain: self.activeTabDomain,
        title: self.newNote.title,
        content: self.newNote.content,
        tags: self.newNote.tags
      });
      newNote.$save(function(response) {
        self.contentToShow = "content";
        self.domainNotes.unshift(newNote);
        self.urlNotes.unshift(newNote);
        self.newNote = Object.create(AppState.initializeNote());
        $state.go('home.views');
        //TODO: create a service that holds the notes for current url and pull it's notes on homeCtrl
      }, function(errorResponse) {
        self.error = errorResponse.data.message;
      })
    };

    self.closeNote = function() {
      if (self.editMode == false) {
        self.newNote = Object.create(AppState.initializeNote());
        //TODO: fix the hack below
        self.newNote.tags = [];
      }
      self.contentToShow = "content";
      self.editMode = false;
      $state.go('home.views');
    };

    self.editNote = function(note) {
      self.editMode = true;
      self.contentToShow = "newNote";
      self.activeNote = note;
      self.editedNote = Object.create(note);
      //TODO: fix the hack below
      self.editedNote.tags = note.tags;
      $state.go('home.views')
    };

    self.update = function() {
      self.editedNote.$update(function() {
        self.editMode = false;
        self.contentToShow = 'content';
        self.domainNotes[self.domainNotes.indexOf(self.activeNote)] = self.editedNote;
        self.urlNotes[self.urlNotes.indexOf(self.activeNote)] = self.editedNote;
        $state.go('home.views');
      }, function(errorResponse) {
        self.error = errorResponse.data.message;
      });
    };

    self.showDeleteDialog = function(ev, note) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .parent(angular.element(document.body))
        .title('Delete this note?')
        .content('This note will be gone forever.')
        .ariaLabel('Delete')
        .ok('Delete')
        .cancel('Keep it')
        .targetEvent(ev);
      $mdDialog.show(confirm).then(function() {
        self.remove(note);
      }, function() {
        $scope.alert = 'You decided to keep your note.';
      });
    };

    self.remove = function(note) {
      if (note) {
        for (var i in self.domainNotes) {
          if (self.domainNotes[i] === note) {
            self.domainNotes.splice(i,1);
          }
          if (self.urlNotes[i] && self.urlNotes[i] === note) {
            self.urlNotes.splice(i,1);
          }
        }
        note.$remove(function() {
          self.contentToShow = "content";
          $state.go('home.views');
        });
      }
    };

    /**
     * called from md-chips directive as md-on-append to transform tag from text to object
     * @param chipText
     * @returns {{text: *, color: string}}
     */
    self.newTagAppend = function(chip) {
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

    /**
     * for the drop down menu in the header
     * TODO: move this to a dedicated directive
     */
    self.dropDownStatus = {
        isopen: false
    };

    // for switching between view modes
    self.setContentToShow = function(content) {
      self.contentToShow = content;
    };

    self.noteHover = function(note) {
      return note.showHidden = !note.showHidden;
    };

    self.goToPage = function(url) {
      $window.open(
        url,
        '_blank'
      )
    };

    // -------------- Settings handlers ----------------
    self.signOut = function() {

    };

    //****************************************************************//
    //******************** PRIVATE FUNCTIONS *************************//
    //****************************************************************//

    /**
     * helper function for creating random colors for tags
     * TODO: move this to a service class that holds helper functions
     * @returns {string}
     */
    function getRandomColor() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    // ---------------- autocomplete stuff -----------------

    self.userTags = loadTags();

    function querySearch (query) {
      var results = query ? self.userTags.filter( createFilterFor(query) ) : self.userTags,
        deferred;
      deferred = $q.defer();
      deferred.resolve( results );
      return deferred.promise;
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(tag) {
        return (tag.textToLower.indexOf(lowercaseQuery) === 0);
      };
    }

    function loadTags() {
      var allTags = self.authentication.user.tags;
      return allTags.map( function (tag) {
        return {
          textToLower: tag.text.toLowerCase(),
          text: tag.text,
          color: tag.color
        };
      });
    }

    //****************************************************************//
    //******************** EVENTS ************************************//
    //****************************************************************//

    //****************************************************************//
    //******************** MESSAGES **********************************//
    //****************************************************************//

    //****************************************************************//
    //******************** INIT **************************************//
    //****************************************************************//

    $state.go('home.views');


  }

  angular.module('clipto')
    .controller('homeController', ['$q', '$scope','$state','Authentication','AppState','Notes', '$mdDialog', 'notes', 'activeTabDomain', 'activeTabUrl', 'ENV', '$window', homeController])

}());
