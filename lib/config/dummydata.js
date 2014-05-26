'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Racer = mongoose.model('Racer'),
  Thing = mongoose.model('Thing'),
  Chat = mongoose.model('Chat');

/**
 * Populate database with sample application data
 */

// Wednesday 28th of May

// Registration [10am - 1pm/2pm - 5pm: HQ, Alvaro Abregon 154, Roma Norte]
// KOM Climb [11am: Anillo Periferico/Desierto de Los Leones, Lomas de San Angel Inn]


//Clear old things, then add things in
 Thing.find({}).remove( function() {
  Thing.create({
    //wednesday
    user: 'ScheduleBot',
    body: 'ADMIN: Wednesday Registration Opens',
    timestamp: '2014-05-28T17:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.417656,
    dropLng: -99.161931
  }, {
    user: 'ScheduleBot',
    body: 'ADMIN: Wednesday Registration Closes',
    timestamp: '2014-05-28T20:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.417656,
    dropLng: -99.161931
  }, {    
    user: 'ScheduleBot',
    body: 'ADMIN: Wednesday Registration Opens',
    timestamp: '2014-05-28T21:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.413279,
    droplng: -99.199584
  }, {
    user: 'ScheduleBot',
    body: 'ADMIN: Wednesday Registration Closes',
    timestamp: '2014-05-29T00:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.417656, 
    dropLng: -99.161931
  }, {    
    user: 'ScheduleBot',
    body: 'SIDE EVENT: KOM Climb',
    timestamp: '2014-05-28T18:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.347485, 
    dropLng: -99.202505 // 19.347485, -99.202505
  }, {
    user: 'ScheduleBot',
    body: 'ADMIN: Thursday Registration Opens',
    timestamp: '2014-05-29T17:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.417656, 
    dropLng: -99.161931
  }, {
    user: 'ScheduleBot',
    body: 'ADMIN: Thursday Registration Closes',
    timestamp: '2014-05-29T20:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.417656,
    dropLng: -99.161931
  }, {    
    user: 'ScheduleBot',
    body: 'ADMIN: Thursday Registration Opens',
    timestamp: '2014-05-29T21:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.417656, 
    dropLng: -99.161931
  }, {
    user: 'ScheduleBot',
    body: 'ADMIN: Thursday Registration Closes',
    timestamp: '2014-05-30T00:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.417656, 
    dropLng: -99.161931
  }, {
// Thursday 29th of May

// Registration [10am - 1pm/2pm - 5pm: HQ]
// Group ride to Olympic Velodrome [9 am HQ]
// Velodrome day [11am -5pm Velodoromo Agustin Melgar, Col. Jardin Balbuena]
// Cantina Hustle [6pm La Glorieta de Insurgentes, Roma Norte]
    user: 'ScheduleBot',
    body: 'SIDE EVENT: Group ride to Olympic Velodrome',
    timestamp: '2014-05-29T16:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    pickLat: 19.417656, 
    pickLng: -99.161931,
    dropLat: 19.409020, 
    dropLng: -99.102575 //19.409020, -99.102575
  }, {    
    user: 'ScheduleBot',
    body: 'SIDE EVENT: Velodrome Day',
    timestamp: '2014-05-29T18:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.409020,
    dropLng: -99.102575 //19.409020, -99.102575
  }, {
    user: 'ScheduleBot',
    body: 'PUB CRAWL: Cantina Hustle',
    timestamp: '2014-05-30T01:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.356276, 
    dropLng: -99.184627
  }, {
    user: 'ScheduleBot',
    body: 'ADMIN: Friday Registration Opens',
    timestamp: '2014-05-30T17:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.417656, 
    droplng: -99.161931
  }, {    
    user: 'ScheduleBot',
    body: 'ADMIN: Friday Registration Closes',
    timestamp: '2014-05-30T21:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.417656, 
    dropLng: -99.161931
  }, {
    user: 'ScheduleBot',
    body: 'ADMIN: First Open Forum',
    timestamp: '2014-05-30T18:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.417656, 
    dropLng: -99.161931
  }, {
    user: 'ScheduleBot',
    body: 'ALLEYCAT: Parque Blackhawk',
    timestamp: '2014-05-30T21:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.409207, 
    dropLng: -99.155589
  }, {
    user: 'ScheduleBot',
    body: 'SPORT: Lucha Libre',
    timestamp: '2014-05-31T03:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.424557,
    dropLng: -99.151843
  }, {
    user: 'ScheduleBot',
    body: 'PARTY: Welcome',
    timestamp: '2014-05-31T03:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.432780,
    dropLng: -99.137476
// Friday 30th of May

// First Open Forum [11am - 1pm]
// Registration [10am - 2pm: HQ]
// Alleycat [2pm: Parque Blackhawk, Avenida Cuauhtemoc, Roma Norte]
// Lucha Libre [8pm - 10pm Arena México, Col Doctores]
// Welcome party [8pm -Pasaguero, Motolinia 33, Centro ]

// Saturday 31st of May

// Final Registration [9am - 11 am, 2sec Chapultepec]
// Main Race Course Inspection [9am - 10am 2sec Chapultepec]
// Main Race Qualifiers [10am - 5pm 2sec Chapultepec]
// Sprint Qualifiers [11am - 4pm 2sec Chapultepec]
// Team footdown [5pm 2sec Chapultepec]
// Warehouse Party [ 7 pm, Bamboo Cycles, Av. 1 37, San Pedro de Los Pinos]
// Sunday 1st of June
  }, {
    user: 'ScheduleBot',
    body: 'ADMIN: Saturday Final Registration Opens',
    timestamp: '2014-05-31T16:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.413279,
    droplng: -99.199584
  }, {    
    user: 'ScheduleBot',
    body: 'RACE: Main Race Course Inspection',
    timestamp: '2014-05-31T16:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.413279,
    droplng: -99.199584
  }, {
    user: 'ScheduleBot',
    body: 'RACE: Main Race Qualifiers',
    timestamp: '2014-05-31T17:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.413279,
    droplng: -99.199584
  }, {
    user: 'ScheduleBot',
    body: 'SIDE EVENT: Sprint Qualifiers',
    timestamp: '2014-05-31T18:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.413279,
    droplng: -99.199584
  }, {
    user: 'ScheduleBot',
    body: 'SIDE EVENT: Team Foot Down',
    timestamp: '2014-06-01T00:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.413279,
    droplng: -99.199584
  }, {
    user: 'ScheduleBot',
    body: 'PARTY: Warehouse',
    timestamp: '2014-06-01T02:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.394240,
    dropLng: -99.184478
// Bullit Cargo race [10am 2sec Chapultepec]
// Main Race Finals [11am - 3pm 2sec Chapultepec]
// Group Photo [3pm 2sec Chapultepe]
// Sprint Finals / Track Stand / Skids [3pm - 5pm 2sec Chapultepec]
// Closing Party / Award Ceremony [9pm - Caradura - Nuevo Leon 37, Condesa.]
// Monday 2nd of June
  }, {
    user: 'ScheduleBot',
    body: 'SIDE EVENT: Bullitt Cargo Race',
    timestamp: '2014-06-01T17:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.413279,
    droplng: -99.199584
  }, {    
    user: 'ScheduleBot',
    body: 'RACE: Main Race Final',
    timestamp: '2014-06-01T17:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.413279,
    droplng: -99.199584
  }, {
    user: 'ScheduleBot',
    body: 'PARTY: Group Photo',
    timestamp: '2014-06-01T21:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.413279,
    droplng: -99.199584
  }, {
    user: 'ScheduleBot',
    body: 'SIDE EVENT: Sprint Final / Track Stand / Skids',
    timestamp: '2014-06-01T21:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.413279,
    droplng: -99.199584
  }, {
    user: 'ScheduleBot',
    body: 'PARTY: Award Ceremony',
    timestamp: '2014-06-02T04:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.414122,
    droplng: -99.171097
  }, {
    user: 'ScheduleBot',
    body: 'ADMIN: Second Open Forum',
    timestamp: '2014-06-02T19:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.417656, 
    dropLng: -99.161931
  }, {
    user: 'ScheduleBot',
    body: 'SIDE EVENT: MDMA Scavenger Hunt',
    timestamp: '2014-06-02T22:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.417656, 
    dropLng: -99.161931
  }, {
    user: 'ScheduleBot',
    body: 'PARTY: 30 Pack Challenge',
    timestamp: '2014-06-03T02:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropLat: 19.417656, 
    dropLng: -99.161931
// Second Open forum [12pm - 2pm HQ]
// MDMA Scavenger hunt [3pm - 6pm HQ]
// CMWC 30 pack challenge [7pm]
  }, function() {
      console.log('finished populating schedule');
    }
  );
});
// Chat.find({}).remove(function() {
//   Chat.create({
//     user: 'alex',
//     company_id: 1,
//     zone:'Mission',
//     body: 'Hellow World',
//     replies: 0
//   }, {
//     user: 'alex',
//     company_id: 1,
//     zone:'Mission',
//     body: 'Mellow Whirled',
//     replies: 0
//   }, {
//     user: 'alex',
//     company_id: 1,
//     zone:'Mission',
//     body: 'Imagine World Peace',
//     replies: 0
//    }, {
//     user: 'alex',
//     company_id: 1,
//     zone:'Mission',
//     body: 'Imagine Whirled Peas',
//     replies: 0
//   }, function() {
//       // console.log('finished populating Chats');
//     }
//   );
// });

// Clear old users, then add a default user
// User.find({}).remove(function() {
//   User.create({
//     provider: 'local',
//     name: 'Test User',
//     email: 'test@test.com',
//     password: 'test'
//   },{
//     provider: 'local',
//     name: 'Audrey II',
//     email: 'feed_me@lilshop.com',
//     password: 'S3ym0r3!'
//   }, function() {
//       // console.log('finished populating users');
//     }
//   );
// });
