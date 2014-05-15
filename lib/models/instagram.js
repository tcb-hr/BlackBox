'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var GramSchema = new Schema({
  user: String,
  timestamp: Date.now,
  url: String,
  type : {type: Number, default: 300},
  pic: { type: String, default: '../images/Alfred_E_Neuman.jpg'}
});

/**
 * Validations
 */
// ThingSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

mongoose.model('Gram', GramSchema);
