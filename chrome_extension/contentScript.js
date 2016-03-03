
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == "getSelection")
    sendResponse({data: window.getSelection().toString()});
  else
    sendResponse({}); // snub them.
});

///**
// * Get the selected text and wrap it with span
// * @param document
// */
//function getSelectionText() {
//  var selection,
//    selectedText,
//    span;
//  if (window.getSelection  && window.getSelection().toString() !== '') {
//    selection = window.getSelection().getRangeAt(0);
//    selectedText = selection.extractContents();
//    span = document.createElement("span");
//    span.setAttribute('class', 'cliptoText');
//    span.style.backgroundColor = "yellow";
//    span.appendChild(selectedText);
//    selection.insertNode(span);
//    $("<span class='cliptoBox'></span>").insertBefore(".cliptoText");
//    $(".cliptoBox").animate({top:e.pageX, left:e.pageY})
//  }
//  //else if (document.getSelection) {
//  //  selection = document.getSelection();
//  //}
//  // selection.toString() !== '' && alert('"' + selection.toString() + '" was selected at ' + e.pageX + '/' + e.pageY);
//  //selection.wrap('<span class = "cliptotest" ></span>')
//}


function getSelectionInsertSpan() {
  var selection,
      span;

  //move this out to global variable
  var cliptoBoxHtml =
    '<div class="cliptoBox">' +
      '<div class="cliptoIconWrapper" style="margin-left:8px">' +
        '<div class="clipIcon">' +
          //'<a href="#">' +
          //  '<img src="chrome.extension.getURL(/icons/paper-clip-3-32-blue.png)">' +
          //'</a>' +
        '</div>' +
      '</div>' +
      '<div class="cliptoIconWrapper">' +
        '<div class="noteIcon">' +
        '</div>' +
      '</div>' +
      '<div class="cliptoIconWrapper">' +
        '<div class="facebookIcon">' +
        '</div>' +
      '</div>' +
      '<div class="cliptoIconWrapper">' +
        '<div class="twitterIcon">' +
        '</div>' +
      '</div>' +
    '</div>';

  if (window.getSelection && window.getSelection().toString() !== '') {
    selection = window.getSelection().getRangeAt(0);
    span = document.createElement("span");
    span.setAttribute('id', 'cliptoHelperSpan');
    selection.insertNode(span);
    //$("#cliptoHelperSpan").append($(cliptoBoxHtml));

    $(cliptoBoxHtml).appendTo("#cliptoHelperSpan").animate({top:-45, left:-20});
  }
}

/**
 * Insert a span before the selected text
 * this is done for positioning it relative
 */
function insertCliptoBox() {
  if ($('#cliptoHelperSpan').length) {
    $('#cliptoHelperSpan').remove();
    getSelectionInsertSpan();
  } else {
    getSelectionInsertSpan();
  }
}

$(document.body).bind('mouseup', function(e){
  insertCliptoBox();

  //$("<span class='cliptoBox'></span>").insertBefore(".cliptoText");

});
