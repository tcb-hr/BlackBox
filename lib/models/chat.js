'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var ChatSchema = new Schema({
  id: Schema.Types.ObjectId,
  user: String,
  company_id: Number,
  zone:String,
  body: String,
  timestamp: { type: Date, default: Date.now },
  type: Number,
  controls: { type: Boolean, default: false},
  pic: { type: String, default: '../images/Alfred_E_Neuman.jpg'},
  image: String,
  slogan: String,
  pickCoordinates: String,
  dropCoordinates: String
});

/**
 * Validations
 */
ChatSchema.path('body').validate(function (str) {
  return str.length >= 1 && str.length <= 300;
}, 'No empty or long messages');

exports.chatModel = mongoose.model('Chat', ChatSchema);
