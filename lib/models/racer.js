'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var RacerSchema = new Schema({
  id: Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now },

  type : Number,
  pic : String,
  user : String,
  image : String,
  place : String,
  team : String,
  country : String,
  city : String,
  racer_number : String,
  current_earnings : Number,
  number_of_jobs : Number
},{
  capped:{
    max: 100000,
    size: 16777216
}

});

/**
 * Validations
 */
// ChatSchema.path('body').validate(function (str) {
//   return str.length >= 1 && str.length <= 140;
// }, 'No empty or long messages');

exports.racerModel = mongoose.model('Racer', RacerSchema);
