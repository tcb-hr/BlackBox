'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) return res.json(400, err);
    
    req.logIn(newUser, function(err) {
      if (err) return next(err);

      return res.json(req.user.userInfo);
    });
  });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
  });
};

/**
 *  Get all users
 */
exports.allUsers = function(req, res) {
  return User.find({}).select('name settings avatar').exec(function (err, chat){
    if (!err) {
      return res.json(chat);
    } else {
      return res.send(err);
    }
  });
};



/**
 * Change password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.send(400);

        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

exports.changeSettings = function(req, res, next){
  // console.log('change settings');
  // console.log(req.body);
  var data = req.body;
  findAndUpdateUser(data.userId, data.propertyKey, data.propertyValue, res);
};

var findAndUpdateUser = function(userId, propertyKey, propertyValue, res){
  var updateObj = {};
  updateObj[propertyKey] = propertyValue;
  User.findByIdAndUpdate(userId, updateObj, function(err, user){
    if(err){
      // console.log('err', err)
      return res.send(400);
    }
    res.send(200);
  });
};

exports.changeAvatar = function(req, res, next){
  var data = req.body;
  // console.log("Avatar?: ", data);
};

/**
 * Get current user
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};

exports.authCallback = function(req, res) {
    res.redirect('/');
};
