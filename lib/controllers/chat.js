'use strict';
var server = require('../../server');
var mongoose = require('mongoose'),
    Chat = mongoose.model('Chat');
var qs = require('qs');
   
/**
 * Create chat message
 */
exports.create = function (req, res, next) {
  var newChat = new Chat(req.body);
  newChat.provider = 'local';
  newChat.save(function(err) {
    if (err) return res.json(400, err);
    
    req.logIn(newChat, function(err) {
      if (err) return next(err);

      return res.json(req.newChat);
    });
  });
};
exports.twinjet = function (req, res, next) {
  var eventType = req.body['event_type'];
  var itemToAdd; 
  if (req.body.applicable_courier){
    req.body.pic = req.body.applicable_courier.small_image;
    req.body.user = 
      req.body.applicable_courier.courier_number + ' ' + (req.body.applicable_courier.nick_name !== '' 
        ? req.body.applicable_courier.nick_name 
        : req.body.applicable_courier.first_name + ' ' + req.body.applicable_courier.last_name);
  } else if (req.body.applicable_job){
    req.body.user = req.body.applicable_job.client_name;    
  }
  getLatLong(req.body);
  switch(eventType){
    case 'courier_check_in':
      itemToAdd = createCourierCheckIn(req.body);
      break;
    case 'courier_check_out':
      itemToAdd = createCourierCheckOut(req.body);
      break;
    case 'job_created':
      itemToAdd = createJobCreated(req.body);
      break;
    case 'job_cancelled':
      itemToAdd = createJobCancelled(req.body);
      break;
    case 'job_edited':
      itemToAdd = createJobEdited(req.body);
      break;
    case 'job_ready':
      itemToAdd = createJobReady(req.body);
      break;
    case 'job_assigned':
      itemToAdd = createJobAssigned(req.body);
      break;
    case 'job_picked':
      itemToAdd = createJobPicked(req.body);
      break;
    case 'job_delivered':
      itemToAdd = createJobDelivered(req.body);
      break;
    case 'job_complete':
      itemToAdd = createJobComplete(req.body);
      break;
    case 'job_late':
      itemToAdd = createJobLate(req.body);
      break;
  }
  console.log(itemToAdd);
  var newChat = new Chat(itemToAdd);
  newChat.provider = 'local';
  newChat.save(function(err) {
    if (err) return res.json(400, err);
    req.logIn(newChat, function(err) {
      if (err) return next(err);
      return res.json(req.newChat);
    });
  });
};

var createCourierCheckIn = function(obj){
  obj.body = "HELLO: " + obj.user + " has checked in.";
  return obj;
};

var createCourierCheckOut = function(obj){
  obj.body = "BYE: " + obj.user + " has checked out.";
  return obj;
};
var createJobCreated = function(obj){
  obj.body =  "NEW: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " was just created by " + obj.user;
  return obj;
};
var createJobCancelled = function(obj){
  obj.body =  "CANCEL: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " was just canceled by " + obj.user;
  return obj;
};
var createJobEdited = function(obj){
  obj.body = "EDIT: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " was just edited by " + obj.user;
  return obj;
};
var createJobReady = function(obj){
  obj.body = "READY: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " is ready";
  return obj;
};
var createJobAssigned = function(obj){
  obj.body = "CLAIMED: " + obj.user + " claimed " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address;
  return obj;
};
var createJobPicked = function(obj){
  obj.body = "PICK: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address;
  return obj;
};
var createJobDelivered = function(obj){
  obj.body =  "DROP: " + obj.user + " dropped the " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address;
  return obj;
};
var createJobComplete = function(obj){
  obj.body = "COMPLETE: " + obj.user + " dropped the " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address;
  return obj;
};
var createJobLate = function(obj){
  obj.body = "LATE: " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " is overdue";
  return obj;
};

var getLatLong = function(reqBody){
  console.log('reqBody', reqBody);
  var pick = reqBody.applicable_job.pick_address;
  var pickLocation = {
    "location": {
      "street": pick.street_address,
      "city": pick.city,
      "state": pick.state,
      "postalCode": pick.zip.slice(0,5)
    }
  };
  
  var drop = reqBody.applicable_job.drop_address;
/*
  var dropLocation = {
    "street": drop.street_address,
    "city": drop.city || 'San Francisco',
    "state": drop.state || 'CA',
    "postalCode": drop.zip.slice(0,5) || ''
  };
*/
  
  var request = require('request');
//  request.post('http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56').form({location: 'Miami, FL'});  
request('http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56' + '&inFormat=json&json=' + JSON.stringify(pickLocation), function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body) // Print the google web page.
    } else{
     console.log('Error! ', response);
    }
  });

// server.app.post('http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56&location=Miami,FL'

 
};
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
