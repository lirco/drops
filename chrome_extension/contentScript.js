chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == "getSelection")
    sendResponse({data: window.getSelection().toString()});
  else
    sendResponse({}); // snub them.
});


$(document.body).bind('mouseup', function(e){
  var selection,
      selectedText,
      span;

  if (window.getSelection && window.getSelection().toString() !== '') {
    selection = window.getSelection().getRangeAt(0);
    selectedText = selection.extractContents();
    span = document.createElement("span");
    span.setAttribute('class', 'cliptoText');
    span.style.backgroundColor = "yellow";
    span.appendChild(selectedText);
    selection.insertNode(span);
    $("<span class='cliptoBox'></span>").insertBefore(".cliptoText");
    $(".cliptoBox").animate({top:e.pageX, left:e.pageY})
  }
  //else if (document.getSelection) {
  //  selection = document.getSelection();
  //}

  // selection.toString() !== '' && alert('"' + selection.toString() + '" was selected at ' + e.pageX + '/' + e.pageY);

  //selection.wrap('<span class = "cliptotest" ></span>')

});



console.log('***************************************');
console.log('ha ha ha');
console.log('***************************************');

