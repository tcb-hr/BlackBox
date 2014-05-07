'use strict';

var mongoose = require('mongoose'),
    // Thing = mongoose.model('Thing'),
    Chat = mongoose.model('Chat');

/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};

exports.chat = function(req, res) {
  var d = new Date();
  d.setDate(d.getDate() - 2);
  d.setTime(d.getTime()-d.getHours()*3600*1000-d.getMinutes()*60*1000);
  return Chat.find().where('timestamp').gt(d).exec(function (err, chat) { 
    if (!err) {
      return res.json(chat);
    } else {
      return res.send(err);
    }
  });
};