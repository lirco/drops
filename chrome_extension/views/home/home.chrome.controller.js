'use strict';

(function () {

  function homeController($scope, $state, Authentication, AppState, notes, viewState, $mdDialog) {
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

    $state.go('home.views');

    self.contentToShow = "content";

    self.setContentToShow = function(content) {
      self.contentToShow = content;
    };

    self.editNote = function(note) {
      AppState.setActiveNote(note);
      $state.go('editNote')
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
      chrome.tabs.create({
        url: 'http://localhost:3000/'
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

  }

  angular.module('drops')
    .controller('homeController', ['$scope','$state','Authentication','AppState','notes', 'viewState', '$mdDialog', homeController])

}());
