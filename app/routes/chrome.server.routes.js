'use strict';

module.exports = function(app) {
	// Routing logic
  var chrome = require('../../app/controllers/chrome');

  app.route('/chromeIndex').get(chrome.chromeIndex);
};
