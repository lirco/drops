/**
 * NOTE:
 * background.js can receive messages from content script only
 * background.js can send messages to both content script and iframe (our app)
 */

(function () {

  // variables ----------------------------------------------------------------
  var self = {};

  //****************************************************************//
  //************************* GLOBALS ******************************//
  //****************************************************************//

  self.sendMessage = function (message, data){
    var data = data || {};

    // find the current tab and send a message to "inject.js" and all the iframes
    chrome.tabs.getSelected(null, function (tab){
      if (!tab) return;

      chrome.tabs.sendMessage(tab.id, {
        message	: message,
        data	: data
      });
    });
  };

  //****************************************************************//
  //************************* PRIVATE FUNCTIONS ********************//
  //****************************************************************//

  function upateCurrentTab (){

    chrome.tabs.getSelected(null, function (tab){
      var url = tab.url;

      // highlight the relevant if already highlighted

    });
  }

  function processMessage (request){
    // process the request
    switch (request.message){
      case 'clipto-iframe-loaded': onIframeLoaded(request.data); break;
      //case 'all-iframes-loaded': message_allIframesLoaded(request.data); break;
    }
  }

  //****************************************************************//
  //************************* EVENTS *******************************//
  //****************************************************************//

  onBrowserActionClicked = function() {
    message_browserActionClicked();
  };

  function onPostMessage (request, sender, sendResponse){
    if (!request.message) return;

    processMessage(request);
  }

  function onTabActivated (){
    upateCurrentTab();
  }

  function onIframeLoaded() {

    chrome.tabs.getSelected(null, function (tab){
      var url = tab.url;

      // notify app about current url
      message_notifyNewUrl(url);
    });
  }

  //****************************************************************//
  //************************* MESSAGES *****************************//
  //****************************************************************//

  function message_notifyNewUrl(url) {
    var data = {};
    data.location = url;
    self.sendMessage('new-tab-location',data)
  }

  function message_browserActionClicked() {
    self.sendMessage('browser-action-clicked')
  }

  //****************************************************************//
  //************************* INIT *********************************//
  //****************************************************************//

  self.init = function() {

    // receive post messages from "content.script.js" and any iframes
    chrome.runtime.onMessage.addListener(onPostMessage);

    // manage when a user change tabs
    chrome.tabs.onActivated.addListener(onTabActivated);

    // listen to browser action click
    chrome.browserAction.onClicked.addListener(onBrowserActionClicked);
  };

  self.init();

}());
