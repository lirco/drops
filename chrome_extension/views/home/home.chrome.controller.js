'use strict';

(function () {

  function homeController($scope, $state, Authentication, AppState, Notes, $mdDialog, notes, activeTabDomain, activeTabUrl) {
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

    $state.go('home.views');

    // initializing the content to show to be the list of notes
    self.contentToShow = "content";

    // for switching between list of notes(content), add a new note screen and settings screen
    self.setContentToShow = function(content) {
      self.contentToShow = content;
    };

    self.noteHover = function(note) {
      return note.showHidden = !note.showHidden;
    };

    self.goToPage = function(url) {
      chrome.tabs.create({
        url: url
      });
    };

    self.goHome = function() {
      chrome.tabs.create({
        url: 'http://localhost:3000/'
      });
    };

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

    /**
     * called from md-chips directive as md-on-append to transform tag from text to object
     * @param chipText
     * @returns {{text: *, color: string}}
     */
    self.newTagAppend = function(chipText) {
      return {
        text: chipText,
        color: getRandomColor()
      }
    };

    // -------------- Notes handlers start----------------
    //TODO: move these to a different controller

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
          $state.go('home.views');
        });
      }
    };

    // autocomplete stuff

    function loadTags() {
      return user.tags.map( function (tag) {
        return {
          text: tag.toLowerCase(),
          color: tag.color
        };
      });
    }


    // -------------- Notes handlers end----------------

    // -------------- Settings handlers start----------------

    self.signOut = function() {

    };
    // -------------- Settings handlers end----------------

  }

  angular.module('drops')
    .controller('homeController', ['$scope','$state','Authentication','AppState','Notes', '$mdDialog', 'notes', 'activeTabDomain', 'activeTabUrl', homeController])

}());
