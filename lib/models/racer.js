'use strict';

var mongoose = require('mongoose'),
    findOrCreate = require('mongoose-findorcreate'),
    Schema = mongoose.Schema;

/**
 * Thing Schema
 */
var RacerSchema = new Schema({
  id: Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now },

// { type: 500,
  type : Number,
//   pic: 'img/no_racer_photo_mini.png',
  pic : String,
//   user: 'Doug Suriano',
  user : String,
//   image: undefined,
  image : String,
//   place: 1,
  place : Number,
//   team: 'TCB',
  team : String,
//   country: 'US',
  country : String,
//   city: 'San Francisco',
  city : String,
//   racer_number: '320',
  racer_number : String,
//   current_earnings: 66,
  current_earnings : Number,
//   number_of_jobs: 0 }
  number_of_jobs : Number,
  racer_name: String
});
/**
 * Validations
 */
// ChatSchema.path('body').validate(function (str) {
//   return str.length >= 1 && str.length <= 140;
// }, 'No empty or long messages');
RacerSchema.plugin(findOrCreate);

exports.racerModel = mongoose.model('Racer', RacerSchema);
