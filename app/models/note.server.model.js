'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var NoteSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  modified: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    default: '',
    trim: true,
    required: 'Title cannot be blank'
  },
  tags: {
    type: Array
  },
  content: {
    type: String,
    default: '',
    trim: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  url: {
    type: String,
    default: '',
    trim: true
  },
  domain: {
    type: String,
    default: '',
    trim: true
  }
});

NoteSchema.pre('save', function(next) {
  this.modified = Date.now();
  next();
});

mongoose.model('Note', NoteSchema);
