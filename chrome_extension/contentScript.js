'use strict';

(function () {

  var self = {};
  self.tempRange = undefined;

  /**
    * extracts the user selection and returns it
   * @returns {{selection: *}}
   */
  function getCliptoUserSelection() {
    var selection;
    if (window.getSelection && window.getSelection().toString() !== '') {
      selection = window.getSelection();
      return selection;
    }
    else return undefined;
  }

  function wrapSelection(selection) {
    var selectionRange = selection.getRangeAt(0),
        wrapSpan = document.createElement("span");
        //SpanTemp = document.createElement("span");

    wrapSpan.setAttribute('id', 'clipto-wrap-span');
    wrapSpan.appendChild(selectionRange.extractContents());
    selectionRange.insertNode(wrapSpan);
    //selectionRange.insertNode(SpanTemp);
    //selection.anchorNode.parentNode.insertBefore(wrapSpan,SpanTemp);


  }

  /**
   * inserts a clipto-helper-span before the user-selected text
   */
  function insertSpan(selection) {
    var selectionRange = selection.getRangeAt(0),
        clipImage = chrome.extension.getURL('icons/attach-24-blue.png'),
        editImage = chrome.extension.getURL('icons/pencil-24-blue.png'),
        span;

    if (selectionRange != undefined) {
      span = document.createElement("span");
      span.setAttribute('id', 'clipto-helper-span');
      selectionRange.insertNode(span);

      $.get(chrome.extension.getURL('/cliptoBox.html'), function(data) {
        $(data).appendTo("#clipto-helper-span").animate({top:-50, left:-20});
        $(".clip-image").attr("src", clipImage);
        $(".edit-image").attr("src", editImage);
      });
    }
  }


  /**
   * cleans the page from previous clipto injections
   * and empty temporary range object
   */
  function cleanPage() {
    $('#clipto-helper-span').remove();
    //later not just remove the id, but remove the span without deleting the content inside
    $('#clipto-wrap-span').removeAttr("id");
    self.tempRange = undefined;
  }

  /**
   * Main clipto function activated on mouseup event
   */
  function cliptoManager(e) {
    var selection = getCliptoUserSelection(),
        selectionRange;

    // User selection is not empty
    if (selection !== undefined) {
      selectionRange = selection.getRangeAt(0);
      // range is the same as the last one
      if (selectionRange == self.tempRange) {
        // click outside cliptoBox, clean page
        console.log('click on something else');
        cleanPage();
      }
      // new range selected, insert cliptoBox
      else {
        cleanPage();
        self.tempRange = selectionRange;
        wrapSelection(selection);
        insertSpan(selection);

        console.log("new range, show cliptobox")
      }
    // User selection is empty
    }
    else {
      // id the clicked element has an id
      if (e.target.attributes.id) {
        //clipto clip button clicked
        if(e.target.attributes.id.nodeValue=="clipto-selection-clip") {
          console.log('click on selection clip');
          cleanPage();
        }
        //clipto edit button clicked
        else if(e.target.attributes.id.nodeValue=="clipto-selection-edit") {
          console.log('click on selection edit');
          cleanPage();
        }
        //clipto image clip button clicked
        else if(e.target.attributes.id.nodeValue=="clipto-image-clip-wrapper") {
          console.log('click on image clip');
          cleanPage();
        }
        //clipto image edit button clicked
        else if(e.target.attributes.id.nodeValue=="clipto-image-edit-wrapper") {
          console.log('click on image edit');
          cleanPage();
        }
        // just a click, do nothing
        else {
          console.log('just a click, clean page and do nothing');
          cleanPage();
        }
      }
      // no id no clipto button - just a click, do nothing
      else {
        console.log('just a click, clean page and do nothing');
        cleanPage();
      }
    }
  }

  $(document).bind('mouseup', function(e){
    cliptoManager(e);
  });


  //****************************************************************//
  //*************** Messaging back to Background Script ************//
  //****************************************************************//

  chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSelection"){
      console.log('***************************************');
      console.log('send me the data!');
      console.log('***************************************');
      sendResponse({data: window.getSelection().toString()});
    }
    else {
      sendResponse({}); // snub them.
    }
  });

}());
