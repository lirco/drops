'use strict';

(function () {

  function homeController($scope, $state, Authentication, AppState, notes, viewState) {
    var self = this;
    self.authentication = {};
    self.authentication.user = Authentication.getUser();

    //self.viewState = viewState;
    self.domainNotes = notes.domainNotes;
    self.urlNotes = notes.urlNotes;

    //$scope.$on('viewEvent:changeViewState', function(type, data){
    //  if (data == 'Page') {
    //    self.viewState = 'Page';
    //    self.notesToShow = self.urlNotes;
    //  } else if (data == 'Site'){
    //    self.viewState = 'Site';
    //    self.notesToShow = self.domainNotes;
    //  }
    //});

    //self.switchViewState = function(viewState){
    //  AppState.setViewState(viewState);
    //  if (viewState == 'Page') {
    //    self.viewState = 'Page';
    //    self.notesToShow = self.urlNotes;
    //  } else if (viewState == 'Site'){
    //    self.viewState = 'Site';
    //    self.notesToShow = self.domainNotes;
    //  }
    //};

    //self.defineNotesToShow = function() {
    //  if (self.viewState == 'Page') {
    //    self.notesToShow = self.urlNotes;
    //  } else if (self.viewState == 'Site') {
    //    self.notesToShow = self.domainNotes;
    //  }
    //};
    //self.defineNotesToShow();

    self.editNote = function(note) {
      AppState.setActiveNote(note);
      $state.go('editNote')
    };

    self.newNote = function() {
      $state.go('newNote');
    };

    self.deleteNote = function(note) {
      note.$remove();

      for (var i in self.domainNotes) {
        if (self.domainNotes[i] === note) {
          self.domainNotes.splice(i,1);
        }
        if (self.urlNotes[i] && self.urlNotes[i] === note) {
          self.urlNotes.splice(i,1);
        }
      }
      self.defineNotesToShow();
    };

    self.noteHover = function(note) {
      return note.showHidden = !note.showHidden;
    };

    self.goToPage = function(note) {
      chrome.tabs.update({
        url: note.url
      });
    };

    self.goHome = function() {
      chrome.tabs.update({
        url: 'http://localhost:3000/'
      });
    }
  }

  angular.module('drops')
    .controller('homeController', ['$scope','$state','Authentication','AppState','notes', 'viewState', homeController])

}());
