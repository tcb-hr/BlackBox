'use strict';

var server = require('../../server'),
    mongoose = require('mongoose'),
    Chat = mongoose.model('Chat'),
    qs = require('qs'),
    fs = require('fs'),
    tj = require('./twinjet.js'),
    map = require('./leaflet.js');

/**
 * Create chat message
 */

exports.create = function (req, res, next) {
  console.log('chat create invoked');
  var newChat = new Chat(req.body);
  newChat.provider = 'local';
  console.log('creating');
  newChat.save(function(err) {
    if (err) {
      console.log('err', err);
      return res.json(400, err);
    } else{
      return res.end();
    }
  });
};

exports.gram = function(tag, req, res, next) {
  var request = require('request-promise');
  // URL for non-batch requests 'http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluub2g6bl1%2Cra%3Do5-9ual56'  
  console.log('in gram');
  request('https://api.instagram.com/v1/tags/' + tag + '/media/recent?client_id=ce171905d26343f4b73d255d2b2f0087')
    .then(function(response) {
      console.log('received instagram response');
      var dbObj = {};
      var resObj = JSON.parse(response);
      dbObj.body = ' INSTAGRAM: ' + resObj.data[0].caption.text;
      //dbObj.timestamp = resObj.data[0].created_time;
      dbObj.user = resObj.data[0].user.username;
      dbObj.image = resObj.data[0].images.low_resolution.url;
      dbObj.pic = resObj.data[0].user.profile_picture;
      saveChatInDatabase(req, res, next, dbObj);
    }).catch(function(response) {
      console.log('Error fetching Instagram!', response);
    });
};

//twinjet chat messages
exports.twinjet = function (req, res, next) {
  var eventType = req.body['event_type'];
  req.body.slogan = tj.slogan();
  var itemToAdd; 

// assign courier name
  if (req.body.applicable_courier) {
    req.body.pic = req.body.applicable_courier.small_image;
    req.body.user = 
      req.body.applicable_courier.courier_number + ' ' + (req.body.applicable_courier.nick_name !== '' ?
        req.body.applicable_courier.nick_name :
        req.body.applicable_courier.first_name + ' ' + req.body.applicable_courier.last_name);
  } else if (req.body.applicable_job) {
    req.body.user = req.body.applicable_job.client_name;
  }

// add event-specific body text
  switch(eventType) {
    case 'courier_check_in':
      itemToAdd = tj.createCourierCheckIn(req.body);
      break;
    case 'courier_check_out':
      itemToAdd = tj.createCourierCheckOut(req.body);
      break;
    case 'job_created':
      itemToAdd = tj.createJobCreated(req.body);
      break;
    case 'job_cancelled':
      itemToAdd = tj.createJobCancelled(req.body);
      break;
    case 'job_edited':
      itemToAdd = tj.createJobEdited(req.body);
      break;
    case 'job_ready':
      itemToAdd = tj.createJobReady(req.body);
      break;
    case 'job_assigned':
      itemToAdd = tj.createJobAssigned(req.body);
      break;
    case 'job_picked':
      itemToAdd = tj.createJobPicked(req.body);
      break;
    case 'job_delivered':
      itemToAdd = tj.createJobDelivered(req.body);
      break;
    case 'job_complete':
      itemToAdd = tj.createJobComplete(req.body);
      break;
    case 'job_late':
      itemToAdd = tj.createJobLate(req.body);
      break;
  }
 
  map.getLatLong(req.body, function(item){saveChatInDatabase(req, res, next, item);});
  // getLatLong(req.body, function(item) {saveChatInDatabase(req, res, next, item);});

};

var saveChatInDatabase = function(req, res, next, itemToAdd) {
  console.log('Saving chat in database');
  var newChat = new Chat(itemToAdd);
  newChat.provider = 'local';
  
  newChat.save(function(err) {

    console.log('err', err);
    fs.appendFile('/home/feed_me/www/feed/db.log', err, function (err) {
       if (err) throw err;
    });
    //if (err) return res.json(400, err);

    /*
    req.logIn(newChat, function(err) {
      if (err) return next(err);
      return res.json(req.newChat);
    });
    */
  });
};
