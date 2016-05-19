/**
 * NOTE:
 * content script can receive messages from both background.js and DOM / iframes
 * content script can only send messages to background.js
 */


'use strict';

(function () {

  // constants ----------------------------------------------------------------
  var ID = {
    CONTAINER		: 'clipto-container',
    IFRAME_PREFIX	: 'clipto-iframe'
  };

  // variables ----------------------------------------------------------------
  var self = {},
    cliptoContainer	= null,
    cliptoActions,
    cliptoPageResize,
    paneWidth = '300px';

  //****************************************************************//
  //************** PageResize CONSTRUCTOR **************************//
  //****************************************************************//

  /**
   * http://stackoverflow.com/questions/10100540/chrome-extension-inject-sidebar-into-page
   *
   * @param width
   * @constructor
   */
  function PageResize(width) {
    this._paneWidth = width;
  }

  PageResize.prototype.getHtml = function() {

    //resolve html tag, which is more dominant than <body>
    var html;

    if (document.documentElement) {
      html = document.documentElement;
    } else if (document.getElementsByTagName('html') && document.getElementsByTagName('html')[0]) {
      html = document.getElementsByTagName('html')[0];
    } else return; //if no html tag found, return

    //position
    if (getComputedStyle(html).position === 'static') {
      html.style.position = 'relative';
    }

    return html;
  };

  PageResize.prototype.shrinkPage = function() {

    var html = this.getHtml();
    var currentWidth = getComputedStyle(html).width;
    html.style.width = parseFloat(currentWidth) - parseFloat(this._paneWidth) + 'px';

  };

  PageResize.prototype.expandPage = function() {

    var html = this.getHtml();
    var currentWidth = getComputedStyle(html).width;
    html.style.width = parseFloat(currentWidth) + parseFloat(this._paneWidth) + 'px';

  };

  //****************************************************************//
  //************** CliptoActions CONSTRUCTOR ***********************//
  //****************************************************************//

  function CliptoActionsClass(userSelection) {
    this._userSelection = userSelection;
    if (this._userSelection !== undefined) {
      this._userSelectionRange = userSelection.getRangeAt(0);
    }
  }

  CliptoActionsClass.prototype.setNewSelection = function(userSelection) {
    this._userSelection = userSelection;
    this._userSelectionRange = userSelection.getRangeAt(0);
  };

  CliptoActionsClass.prototype.wrapSelection = function() {
    this._wrapSpan = document.createElement("span");
    this._wrapSpan.setAttribute('id', 'clipto-wrap-span');
    this._wrapSpan.appendChild(this._userSelectionRange.extractContents());
    this._userSelectionRange.insertNode(this._wrapSpan);
  };

  CliptoActionsClass.prototype.insertSpan = function() {
    if (this._userSelectionRange != undefined) {
      var span;
      span = document.createElement("span");
      span.setAttribute('id', 'clipto-helper-span');
      this._userSelectionRange.insertNode(span);

      $.get(chrome.extension.getURL('/clipto.box.html'), function(data) {
        $(data).appendTo("#clipto-helper-span").animate({top:-50, left:-20});
        $(".clip-image").attr("src", self.clipImage);
        $(".edit-image").attr("src", self.editImage);
      });
    }
  };

  //****************************************************************//
  //*********************** MANAGER FUNCTION ***********************//
  //****************************************************************//
  /**
   * Main clipto function activated on mouseup event
   */
  self.cliptoManager = function(e) {

    self.selection = self.getUserSelection();
    if (self.selection !== undefined) {
      self.selectionRange = self.selection.getRangeAt(0);
    }

    // User selection is not empty
    if (self.selection !== undefined) {
      // range is the same as the last one
      if (self.selectionRange == self.tempRange) {
        // click outside cliptoBox, clean page
        console.log('click on something else');
        self.cleanPage();
      }
      // new range selected, insert cliptoBox
      else {
        self.cleanPage();
        self.tempRange = self.selectionRange;
        cliptoActions.setNewSelection(self.selection);
        cliptoActions.wrapSelection();
        cliptoActions.insertSpan();
      }
    }
    // User selection is empty
    else {
      // the clicked element has an id
      if (e.target.attributes.id) {
        //clipto clip button clicked
        if(e.target.attributes.id.nodeValue=="clipto-selection-clip") {
          console.log('click on selection clip');
          $("#clipto-container").css("right", 0);
          self.cleanPage();
        }
        //clipto image clip button clicked
        else if(e.target.attributes.id.nodeValue=="clipto-image-clip-wrapper") {
          console.log('click on image clip');
          self.cleanPage();
        }
        // just a click, do nothing
        else {
          console.log('just a click, clean page and do nothing 1');
          self.cleanPage();
        }
      }
      // no id no clipto button - just a click, do nothing
      else {
        console.log('just a click, clean page and do nothing 2');
        self.cleanPage();
      }
    }
  };

  //****************************************************************//
  //************************* GLOBALS ******************************//
  //****************************************************************//

  self.tempRange = undefined;
  self.isPaneOpen = false;
  self.clipImage = chrome.extension.getURL('icons/attach-24-blue.png');
  self.editImage = chrome.extension.getURL('icons/pencil-24-blue.png');

  self.getUserSelection = function() {
    if (window.getSelection && window.getSelection().toString() !== '') {
      return window.getSelection();
    }
    else return undefined;
  };

  self.cleanPage = function() {
    $('#clipto-helper-span').remove();
    //later not just remove the id, but remove the span without deleting the content inside
    $('#clipto-wrap-span').removeAttr("id");
    self.tempRange = undefined;
  };

  self.insertCliptoContainer = function() {
    cliptoContainer = $('<div />', {id:ID.CONTAINER});
    cliptoContainer.appendTo(document.body);
  };

  self.insertCliptoPane = function() {
    var src		= chrome.extension.getURL('/clipto.pane.html'),
      iframe	= $('<iframe />', {id:ID.IFRAME_PREFIX, src:src, scrolling:false});
    cliptoContainer.append(iframe);
  };

  // Each message request has a string message and an optional data object
  self.sendMessage = function(message, data){
    var data = data || {};

    // send a message to "background.js"
    chrome.runtime.sendMessage({
      message : message,
      data	: data
    });
  };

  self.processMessage = function(request){
    if (!request.message) return;

    switch (request.message){
      case 'clipto-iframe-loaded': onIframeLoaded(request.data); break;
      case 'browser-action-clicked': onBrowserActionClick(request.data); break;
      case 'clipto-close-pane': onClosePane(request.data); break;
    }
  };

  //****************************************************************//
  //******************** PRIVATE FUNCTIONS *************************//
  //****************************************************************//

  function openPane() {
    $("#clipto-container").css("right", 0);
  }

  function closePane() {
    $("#clipto-container").css("right", -300);
  }

  //****************************************************************//
  //******************** EVENTS ************************************//
  //****************************************************************//

  function onIframeLoaded() {
    message_onIframeLoaded();
  }

  function onBrowserActionClick() {
    if (self.isPaneOpen == false) {
      cliptoPageResize.shrinkPage();
      openPane();
      self.isPaneOpen = true;
    } else {
      cliptoPageResize.expandPage();
      closePane();
      self.isPaneOpen = false;
    }
  }

  function onClosePane() {
    if (self.isPaneOpen == true) {
      cliptoPageResize.expandPage();
      closePane();
      self.isPaneOpen = false;
    }
  }

  // messages coming from iframes and the current webpage
  function dom_onMessage (event){
    if (!event.data.message) return;

    self.processMessage(event.data);
  }

  // messages coming from "background.js"
  function background_onMessage (request, sender, sendResponse){
    if (!request.message) return;

    self.processMessage(request);
  }

  //****************************************************************//
  //******************** MESSAGES **********************************//
  //****************************************************************//

  function message_onIframeLoaded (){
    //send the message back to background.js
    self.sendMessage('clipto-iframe-loaded');

  }

  //****************************************************************//
  //***************** INIT ON EACH PAGE LOAD ***********************//
  //****************************************************************//

  self.init = function() {

    // init new clipto subclass
    cliptoActions = new CliptoActionsClass(undefined);
    cliptoPageResize = new PageResize(paneWidth);

    // insert clipto pane
    self.insertCliptoContainer();
    self.insertCliptoPane();

    // listen to the iframe messages
    window.addEventListener("message", dom_onMessage, false);

    // listen to the Control Center (background.js) messages
    chrome.runtime.onMessage.addListener(background_onMessage);

    //bind mouseup event
    $(document).bind('mouseup', function(e){
      self.cliptoManager(e);
    });
  };

  self.init();




}());
