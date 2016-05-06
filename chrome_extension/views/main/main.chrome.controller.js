/**
 * NOTE:
 * an iframe (our app in this case) can only receive messages from background.js
 * our iframe (app) can only send messages to content script.
 */

(function () {

  function mainController($http, $state, Authentication, AppState, ENV) {

    //****************************************************************//
    //******************** GLOBALS ***********************************//
    //****************************************************************//

    var self = this;

    self.authentication = {};
    self.activeTabUrl = '';

    //****************************************************************//
    //******************** PRIVATE FUNCTIONS *************************//
    //****************************************************************//

    function setLocation(location) {
      self.activeTabUrl = location;
      var domain ='';
      var domainArray = location.match(/^[\w-]+:\/*\[?([\w\.:-]+)\]?(?::\d+)?/)[1].split(".");

      if (domainArray.length == 2) {
        domain = domainArray.join('.');
      }
      else {
        domain = domainArray.splice(1).join('.');
      }
      AppState.setActiveTabUrl(location);
      AppState.setActiveTabDomain(domain);
    }

    function getAuthentication() {
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
    }

    //// get the tab domain and url
    //chrome.tabs.query({'active': true, 'lastFocusedWindow': true, 'currentWindow': true}, function (tabs) {


    // Each message request has a string message and an optional data object
    function sendMessage(message, data){
      var data = data || {};

      window.parent.postMessage({
        message	: message,
        data	: data
      }, '*');
    }

    function processMessage(request){
      if (!request.message) return;

      switch (request.message){
        case 'new-tab-location': onLocationReceived(request.data); break;
        //case 'save-iheart': message_onSaved(request.data); break;
      }
    }

    //****************************************************************//
    //******************** EVENTS ************************************//
    //****************************************************************//

    function background_onMessage (request, sender, sendResponse){
      if (!request.message) return;

      // call the listener callback
      processMessage(request);
    }

    function onLocationReceived(data) {
      if (!data.location) return;
      setLocation(data.location);
    }

    //****************************************************************//
    //******************** MESSAGES **********************************//
    //****************************************************************//

    //****************************************************************//
    //******************** INIT **************************************//
    //****************************************************************//

    // notify content script we are loaded
    sendMessage('clipto-iframe-loaded');

    // listen to the Control Center (background.js) messages
    chrome.runtime.onMessage.addListener(background_onMessage);

    getAuthentication()


  }

  angular.module('clipto')
    .controller('mainController', ['$http', '$state', 'Authentication','AppState', 'ENV', mainController])

}());
