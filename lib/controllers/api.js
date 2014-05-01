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
  return Chat.find(function (err, chat) {
    if (!err) {
      return res.json(chat);
    } else {
      return res.send(err);
    }
  });
};