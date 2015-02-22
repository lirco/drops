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

  note.save(function(err) {
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

  note = _.extend(note, req.body);

  note.save(function(err) {
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
  function findNotes(qKey, qValue) {
    var query = {};
    query[qKey] = qValue;
    Note.find(query).sort('-created').populate('user', 'displayName').exec(function(err, notes) {
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
    findNotes('domain', req.query.domain)
  } else if (req.query.tags) {
    findNotes('tags', req.query.tags)
  } else {
    findNotes(null, null)

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
