'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var ThingSchema = new Schema({
  id: Schema.Types.ObjectId,
  user: { type: String, default : 'ScheduleBot'},
  body: String,
  timestamp: Date,
  type: {type: Number, default: 600},
  pic: { type: String, default: '../images/cropped-fcbkbanner5.jpg'},
  dropCoordinates: String
});

/**
 * Validations
 */
// ThingSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

exports.model = mongoose.model('Thing', ThingSchema);
