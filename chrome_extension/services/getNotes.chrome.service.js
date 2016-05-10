/**
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

    function fetchNotes() {
      var d = $q.defer();
      Notes.getNotes({domain: AppState.getActiveTabDomain()}, function(response) {
        self.notes.domainNotes = response;

        self.notes.urlNotes = [];
        for (var i=0; i < response.length; i++) {
          var note = response[i];
          if (note.url == AppState.getActiveTabUrl()) {
            self.notes.urlNotes.push(note);
          }
        }
        d.resolve(self.notes)
      });
      return d.promise;
    }

    return {
      getNotes: fetchNotes
    }
  }

  angular.module('clipto')
    .service('GetNotes', ['$q','Notes','AppState', getNotes])
}());
