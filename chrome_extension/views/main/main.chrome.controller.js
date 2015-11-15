(function () {

  function mainController($scope, $http, $state, Authentication, AppState, ENV) {

    var self = this;

    self.authentication = {};
    self.activeTabUrl = '';

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, function (tabs) {

      var domain ='';
      var uri = tabs[0].url;
      var domainArray = uri.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1].split(".");


      if (domainArray.length == 2) {
        domain = domainArray.join('.');
      }
      else {
        domain = domainArray.splice(1).join('.');
      }
      self.activeTabUrl = uri;
      AppState.setActiveTabUrl(uri);
      AppState.setActiveTabDomain(domain);

      $http({
        method:'get',
        url:ENV.apiEndPoint+'/chromeIndex'
      })
        .then(function(response) {
          Authentication.setUser(response.data.user);
          self.authentication.user = Authentication.getUser()
        })
        .then(function(){
          if (self.authentication.user !==null) {
            $state.go('home');
          } else {
            $state.go('signIn');
          }
        })
    });

  }

  angular.module('drops')
    .controller('mainController', ['$scope', '$http', '$state', 'Authentication','AppState', 'ENV', mainController])

}());
