'use strict';
var server = require('../../server');
var mongoose = require('mongoose');
var Chat = mongoose.model('Chat');
var qs = require('qs');

// Get Lat Long Coordinates from Map Quest 
var getLatLong = function(reqBody, callback){
  var array = [];
  
  var locations = {
    "locations": []
  };

  var makeLocationObject = function(location){
    if(location.street_address !==  undefined){
      var newObj = {};
      newObj.street = location.street_address;
      newObj.city = location.city || 'San Francisco';
      newObj.state = location.state || 'CA';
      if(location.zip !== null){
        newObj.postalCode = location.zip.slice(0,5);
      }
      locations.locations.push(newObj);    
    }
  };

  var pick = reqBody.applicable_job.pick_address;
  var drop = reqBody.applicable_job.drop_address;
  makeLocationObject(pick);
  makeLocationObject(drop);
  
  var request = require('request-promise');
  // URL for non-batch requests 'http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56'  
  request('http://open.mapquestapi.com/geocoding/v1/batch?key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56' + '&inFormat=json&json=' + JSON.stringify(locations))
    .then(function(response){
      var pickCoordinates = JSON.parse(response).results[0].locations[0].latLng || null;
      var dropCoordinates = JSON.parse(response).results[1].locations[0].latLng || null;
      reqBody.pickCoordinates = JSON.stringify(pickCoordinates);
      reqBody.dropCoordinates = JSON.stringify(dropCoordinates);
      callback(reqBody);
    }).catch(function(response){
      console.log('Error! ', response);
      callback(reqBody);
    });
};
 
/**
 * Create chat message
 */


exports.create = function (req, res, next) {
  console.log('create');
  var newChat = new Chat(req.body);
  newChat.provider = 'local';
  newChat.save(function(err) {
    if (err){
      console.log('err', err);
      return res.json(400, err);
    }
  
    req.logIn(newChat, function(err) {
      if (err) return next(err);

      return res.json(req.newChat);
    });
 
  });
};


exports.twinjet = function (req, res, next) {
  var eventType = req.body['event_type'];
  var itemToAdd; 

// assign courier name
  if (req.body.applicable_courier){
    req.body.pic = req.body.applicable_courier.small_image;
    req.body.user = 
      req.body.applicable_courier.courier_number + ' ' + (req.body.applicable_courier.nick_name !== '' 
        ? req.body.applicable_courier.nick_name 
        : req.body.applicable_courier.first_name + ' ' + req.body.applicable_courier.last_name);
  } else if (req.body.applicable_job){
    req.body.user = req.body.applicable_job.client_name;    
  }

// add event-specific body text
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
 
  getLatLong(req.body, function(item){saveChatInDatabase(req, res, next, item);});

};

var saveChatInDatabase = function(req, res, next, itemToAdd){
  console.log('adding', itemToAdd);
  var newChat = new Chat(itemToAdd);
  console.log('new chat', newChat);
  newChat.provider = 'local';
  newChat.save(function(err) {
    console.log('err', err);
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
