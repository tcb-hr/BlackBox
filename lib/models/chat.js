'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var ChatSchema = new Schema({
  id: Schema.Types.ObjectId,
  user: String,
  body: String,
  timestamp: { type: Date, default: Date.now },
  replies: Number
});

/**
 * Validations
 */
ChatSchema.path('body').validate(function (str) {
  return str.length >= 0 && str.length <= 140;
}, 'No empty or long messages');

mongoose.model('Chat', ChatSchema);
