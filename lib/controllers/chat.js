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
