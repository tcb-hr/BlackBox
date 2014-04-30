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
  console.log('req.body', req.body);
  var eventType = req.body['event_type'];
  console.log('eventType', eventType);
  var itemToAdd;
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
  obj.user = obj.applicable_courier.nick_name;
  obj.body = obj.user + " has checked in.";
  return obj;
};



