(function () {

  function AppState() {

    var self = this;
    self.activeTabUrl = '';
    self.activeTabDomain = '';
    self.activeNote = {};

    return {
      setActiveTabUrl: function(url) {
        self.activeTabUrl = url
      },
      getActiveTabUrl: function() {
        return self.activeTabUrl;
      },
      setActiveTabDomain: function(domain) {
        self.activeTabDomain = domain;
      },
      getActiveTabDomain: function() {
        return self.activeTabDomain;
      },
      setActiveNote: function(note) {
        self.activeNote = note
      },
      getActiveNote: function() {
        return self.activeNote
      }
    }
  }

  angular.module('drops')
    .factory('AppState', [AppState])

}());
