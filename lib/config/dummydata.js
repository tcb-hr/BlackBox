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
    user: 'ScheduleBot'
    body: 'ADMIN: Wed Registration Opens',
    timestamp: '2014-05-28T17:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: String
  }, {
    user: 'ScheduleBot'
    body: 'ADMIN: Wed Registration Closes',
    timestamp: '2014-05-28T20:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: {lat: '19.417656', lng: '-99.161931'}
  }, {    
    user: 'ScheduleBot'
    body: 'ADMIN: Wed Registration Opens',
    timestamp: '2014-05-28T21:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: {lat: '19.417656', lng: '-99.161931'}
  }, {
    user: 'ScheduleBot'
    body: 'ADMIN: Wed Registration Closes',
    timestamp: '2014-05-29T00:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: {lat: '19.417656', lng: '-99.161931'}
  }, {    
    user: 'ScheduleBot'
    body: 'SIDE EVENT: KOM Climb',
    timestamp: '2014-05-28T18:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: {lat: '19.347485', lng: '-99.202505'} // 19.347485, -99.202505
  }, {
    user: 'ScheduleBot'
    body: 'ADMIN: Thu Registration Opens',
    timestamp: '2014-05-29T17:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: {lat: '19.417656', lng: '-99.161931'}
  }, {
    user: 'ScheduleBot'
    body: 'ADMIN: Thu Registration Closes',
    timestamp: '2014-05-29T20:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: {lat: '19.417656', lng: '-99.161931'}
  }, {    
    user: 'ScheduleBot'
    body: 'ADMIN: Thu Registration Opens',
    timestamp: '2014-05-29T21:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: {lat: '19.417656', lng: '-99.161931'}
  }, {
    user: 'ScheduleBot'
    body: 'ADMIN: Thu Registration Closes',
    timestamp: '2014-05-30T00:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: {lat: '19.417656', lng: '-99.161931'}
  }, {
// Thursday 29th of May

// Registration [10am - 1pm/2pm - 5pm: HQ]
// Group ride to Olympic Velodrome [9 am HQ]
// Velodrome day [11am -5pm Velodoromo Agustin Melgar, Col. Jardin Balbuena]
// Cantina Hustle [6pm La Glorieta de Insurgentes, Roma Norte]
    user: 'ScheduleBot'
    body: 'SIDE EVENT: Group ride to Olympic Velodrome',
    timestamp: '2014-05-29T16:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    pickCoordinates: {lat: '19.417656', lng: '-99.161931'}
    dropCoordinates: {lat: '19.409020', lng: '-99.102575'} //19.409020, -99.102575
  }, {    
    user: 'ScheduleBot'
    body: 'SIDE EVENT: Velodrome Day',
    timestamp: '2014-05-29T18:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: {lat: '19.409020', lng: '-99.102575'} //19.409020, -99.102575
  }, {
    user: 'ScheduleBot'
    body: 'PUB CRAWL: Cantina Hustle',
    timestamp: '2014-05-30T01:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: {lat: '19.356276', lng: '-99.184627'}
  }, {
    user: 'ScheduleBot'
    body: 'ADMIN: Fri Registration Opens',
    timestamp: '2014-05-30T17:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: {lat: '19.417656', lng: '-99.161931'}
  }, {    
    user: 'ScheduleBot'
    body: 'ADMIN: Fri Registration Closes',
    timestamp: '2014-05-30T21:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: {lat: '19.417656', lng: '-99.161931'}
  }, {
    user: 'ScheduleBot'
    body: 'ADMIN: First Open Forum',
    timestamp: '2014-05-30T18:00:00Z',
    pic: '../images/cropped-fcbkbanner5.jpg',
    dropCoordinates: String
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

// Bullit Cargo race [10am 2sec Chapultepec]
// Main Race Finals [11am - 3pm 2sec Chapultepec]
// Group Photo [3pm 2sec Chapultepe]
// Sprint Finals / Track Stand / Skids [3pm - 5pm 2sec Chapultepec]
// Closing Party / Award Ceremony [9pm - Caradura - Nuevo Leon 37, Condesa.]
// Monday 2nd of June

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
