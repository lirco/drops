'use strict';

 (function () {

  function Authentication() {
    var self = this;
    self.user = window.user;

    return {
      setUser: function(user) {
        self.user = user;
      },
      removeUser: function() {
        self.user = null;
      },
      getUser: function() {
        return {
          user: self.user
        }
      }
    }
  }

  angular.module('users')
    .factory('Authentication', [Authentication])

}());
