'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
/**
 * Thing Schema
 */
var TwinjetSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  payload: String
});

/**
 * Validations
 */
// ThingSchema.path('awesomeness').validate(function (num) {
//   return num >= 1 && num <= 10;
// }, 'Awesomeness must be between 1 and 10');

mongoose.model('Twinjet', TwinjetSchema);

// example payload
// {
//     "applicable_courier": {
//         "first_name": "Douglas",
//         "last_name": "Suriano",
//         "large_image": "http://twinjet.static.s3.amazonaws.com/large_profile_images/1.jpg",
//         "nick_name": "Doug",
//         "courier_number": "320",
//         "small_image": "http://twinjet.static.s3.amazonaws.com/small_profile_images/1.jpg",
//         "twinjet_username": "doug",
//         "medium_image": "http://twinjet.static.s3.amazonaws.com/medium_profile_images/1.jpg"
//     },
//     "timestamp": "2014-04-26T22:39:02.071326+00:00",
//     "notes": "",
//     "company_id": 2,
//     "applicable_job": {
//         "pick_address": {
//             "city": "San Francisco",
//             "name": "Dougs House",
//             "zip": "94109",
//             "floor": "",
//             "state": "CA",
//             "street_address": "1525 Sacramento St"
//         },
//         "job_id": 109,
//         "client_name": "Doug's Country Bunker",
//         "ready_time": "2014-04-24T18:51:00-07:00",
//         "due_time": "2014-04-24T19:06:00-07:00",
//         "drop_address": {
//             "city": "San Francisco",
//             "name": "Haus",
//             "zip": "94109-8140",
//             "floor": "",
//             "state": "CA",
//             "street_address": "565 Ellis St"
//         }
//     },
//     "event_type": "job_assigned"
// }