'use strict';

(function () {

  var self = this;

  chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method == "getSelection")
      sendResponse({data: window.getSelection().toString()});
    else
      sendResponse({}); // snub them.
  });

  /**
   * extracts the user selection and returns it as object with the selectionRange and selected string
   * @returns {{selection: *, selectionAsString: *}}
   */
  function getSelection() {
    var selectionRange,
        selectionString;
    if (window.getSelection && window.getSelection().toString() !== '') {
      selectionRange = window.getSelection().getRangeAt(0);
      selectionString = window.getSelection().toString();
    }
    return {
      selectionRange: selectionRange,
      selectionString: selectionString
    };
  }

  /**
   * inserts a clipto-helper-span before the user-selected text
   */
  function insertSpan() {
    var selection,
        span,
        clipImage = chrome.extension.getURL('icons/attach-24-blue.png'),
        editImage = chrome.extension.getURL('icons/pencil-24-blue.png');

    selection = getSelection();
    if (selection) {
      span = document.createElement("span");
      span.setAttribute('id', 'clipto-helper-span');
      selection.selectionRange.insertNode(span);

      $.get(chrome.extension.getURL('/cliptoBox.html'), function(data) {
        $(data).appendTo("#clipto-helper-span").animate({top:-50, left:-20});
        $(".clip-image").attr("src", clipImage);
        $(".edit-image").attr("src", editImage);
      });
    }
  }

  /**
   * Main function to insert a span before the selected text in condition
   */
  function insertCliptoBox() {
    if ($('#clipto-helper-span').length) {
      $('#clipto-helper-span').remove();
      insertSpan();
    } else {
      insertSpan();
    }
  }
  
  $(document.body).bind('mouseup', function(e){
    insertCliptoBox();
  });

}());
