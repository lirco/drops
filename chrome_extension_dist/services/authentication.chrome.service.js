(function () {

  function Authentication() {
    var self = this;
    self.user = null;

    return {
      setUser: function(user) {
        self.user = user;
      },
      removeUser: function() {
        self.user = null;
      },
      getUser: function() {
        return self.user;
      }
    }
  }

  angular.module('drops')
    .factory('Authentication', [Authentication])

}());
