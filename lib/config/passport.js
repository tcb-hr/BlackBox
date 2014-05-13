'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google').Strategy,
    configAuth = require('./auth'),
    User = require('../models/user');
/**
 * Passport configuration
 */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findOne({
    _id: id
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    done(err, user);
  });
});

// add other strategies for more authentication flexibility
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function(email, password, done) {
    User.findOne({
      email: email.toLowerCase()
    }, function(err, user) {
      if (err) return done(err);
      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          message: 'This password is not correct.'
        });
      }
      return done(null, user);
    });
  }
));

// passport.use(new BearerStrategy(
//   function(token, done) {
//     User.findOne({ token: token }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       return done(null, user, { scope: 'read' });
//     });
//   }
// ));

// passport.use(new GoogleStrategy({
//     returnURL: 'http://localhost:80', //change this for deployment
//     realm: 'http://localhost:80',
// or this
//     returnURL: 'http://http://191.236.103.192:80', //change this for deployment
//     realm: 'http://http://191.236.103.192:80',
//   },
//   function(identifier, profile, done) {
//     User.findOrCreate({ openId: identifier }, function(err, user) {
//       done(err, user);
//     });
//   }
// ));

passport.use(new GoogleStrategy({
    returnURL       : configAuth.googleAuth.callbackURL, //change this for deployment
    clientID        : configAuth.googleAuth.clientID,
    clientSecret    : configAuth.googleAuth.clientSecret,
    callbackURL     : configAuth.googleAuth.callbackURL,
  },
  function(accessToken, refreshToken, profile, done) {
  console.log(accessToken, refreshToken, profile, done);
  console.log('email is: ', JSON.parse(profile));
    User.findOne({
      email : profile.emails[0].value
    }, function(err, user) {
      if (!user) {
        user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          provider: 'google',
          google: profile._json
        });
        user.save(function(err) {
          if (err) // console.log(err);
          return done(err, user);
        });
      } else {
          return done(err, user);
      }
  });
  }
));

module.exports = passport;
