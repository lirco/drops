'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
  notes = require('../../app/controllers/notes');

module.exports = function(app) {
  // Article Routes
  app.route('/notes')
    .get(notes.list)
    .post(users.requiresLogin, notes.create);

  app.route('/notes/:noteId')
    .get(notes.read)
    .put(users.requiresLogin, notes.hasAuthorization, notes.update)
    .delete(users.requiresLogin, notes.hasAuthorization, notes.delete);

  // Finish by binding the note middleware
  app.param('noteId', notes.noteByID);

};
