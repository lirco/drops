'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
  Note = mongoose.model('Note'),
  _ = require('lodash');

/**
 * Create a note
 */
exports.create = function(req, res) {
  var note = new Note(req.body);
  note.user = req.user;
  var user = req.user;

  /**
   * check if the tag already exists in the user's tags
   * TODO: make in async friendly for god's sake
   */
  for (var i = 0; i < req.body.tags.length ; i++) {
    var newTag = req.body.tags[i];
    var index = -1;
    for (var j = 0; j < user.tags.length ; j++) {
      if (user.tags[j].text == newTag.text) {
        index = j;
        break;
      }
    }
    if (index == -1) {
      user.tags.push(newTag);
    }
  }

  note.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      user.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(note);
        }
      })
    }
  });
};

/**
 * Show the current note
 */
exports.read = function(req, res) {
  res.jsonp(req.note);
};

/**
 * Update a note
 */
exports.update = function(req, res) {
  var note = req.note;
  var user = req.user;
  var newTags = req.body.tags || '';

  function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  for (var i = 0; i < newTags.length ; i++) {
    var newTag = newTags[i];
    var index = -1;
    for (var j = 0; j < user.tags.length ; j++) {
      if (user.tags[j].text == newTag.text) {
        index = j;
        break;
      }
    }
    if (index == -1) {
      newTag.color = getRandomColor();
      user.tags.push(newTag);
    }
  }
  note = _.extend(note, req.body);

  note.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      user.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.jsonp(note);
        }
      })
    }
  });
};

/**
 * Delete an note
 */
exports.delete = function(req, res) {
  var note = req.note;

  note.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(note);
    }
  });
};

/**
 * List of Articles
 */
exports.list = function(req, res) {
  //finds notes for a specific user, acc. to domain/tags delivered
  function findNotes(qKey, qValue) {
    var query = {};
    query[qKey] = qValue;
    query['user'] = req.user._id;
    Note.find(query).sort('-created').populate('user', 'username').exec(function(err, notes) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(notes);
      }
    });
  }
  if (req.query.domain) {
    findNotes('domain', req.query.domain);
  } else if (req.query.tags) {
    findNotes('tags', req.query.tags);
  } else {
    findNotes(null, null);

  }
};

/**
 * note middleware
 */
exports.noteByID = function(req, res, next, id) {
  Note.findById(id).populate('user', 'displayName').exec(function(err, note) {
    if (err) return next(err);
    if (!note) return next(new Error('Failed to load note ' + id));
    req.note = note;
    next();
  });
};

/**
 * note authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
  if (req.note.user.id !== req.user.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
  next();
};
