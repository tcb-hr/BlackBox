'use strict';

var mongoose = require('mongoose'),
    Chat = mongoose.model('Chat');
    
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
    req.body.pic
    req.body.user = 
      req.body.applicable_courier.courier_number + ' ' + (req.body.applicable_courier.nick_name !== '' 
        ? req.body.applicable_courier.nick_name 
        : req.body.applicable_courier.first_name + ' ' + req.body.applicable_courier.last_name);
  } else if (req.body.applicable_job){
    req.body.user = req.body.applicable_job.client_name;    
  }
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
  obj.body = "<b>HELLO:</b> " + obj.user + " has checked in.";
  return obj;
};

var createCourierCheckOut = function(obj){
  obj.body = "<b>BYE:</b> " + obj.user + " has checked out.";
  return obj;
};
var createJobCreated = function(obj){
  obj.body =  "<b>NEW:</b> " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " was just created by " + obj.user;
  return obj;
};
var createJobCancelled = function(obj){
  obj.body =  "<b>CANCEL:</b> " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " was just canceled by " + obj.user;
  return obj;
};
var createJobEdited = function(obj){
  obj.body = "<b>EDIT:</b> " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " was just edited by " + obj.user;
  return obj;
};
var createJobReady = function(obj){
  obj.body = "<b>READY:</b> " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " is ready";
  return obj;
};
var createJobAssigned = function(obj){
  obj.body = "<b>CLAIMED:</b> " + obj.user + " claimed " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address;
  return obj;
};
var createJobPicked = function(obj){
  obj.body = "<b>PICK:</b> " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address;
  return obj;
};
var createJobDelivered = function(obj){
  obj.body =  "<b>DROP:</b> " + obj.user + " dropped the " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address;
  return obj;
};
var createJobComplete = function(obj){
  obj.body = "<b>COMPLETE:</b> " + obj.user + " dropped the " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address;
  return obj;
};
var createJobLate = function(obj){
  obj.body = "<b>LATE:</b> " + obj.applicable_job.client_name + " to " + obj.applicable_job.drop_address.street_address + " is overdue";
  return obj;
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