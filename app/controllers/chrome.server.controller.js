'use strict';

/**
 * Module dependencies.
 */

exports.chromeIndex = function(req, res) {
  if (req.user) {
    res.send({
      user: req.user
    });
  } else {
    res.send({
      user: null
    });
  }
};

