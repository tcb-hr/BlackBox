'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var RacerSchema = new Schema({
  id: Schema.Types.ObjectId,

  timestamp: { type: Date, default: Date.now }

  type : Number,
  pic : String,
  user : String,
  image : String,
  // body : req.body.standings[i].message,
  place: String,
  team: String,
  country: String,
  current_earnings: Number,
  number_of_jobs: Number

});

/**
 * Validations
 */
// ChatSchema.path('body').validate(function (str) {
//   return str.length >= 1 && str.length <= 140;
// }, 'No empty or long messages');

exports.chatModel = mongoose.model('Racer', RacerSchema);
