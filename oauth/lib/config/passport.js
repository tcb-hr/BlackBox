'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    config = require('./config'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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
      email: email
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






//Use google strategy
passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
      User.findOne({
          'google.id': profile.id
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
                  if (err) console.log(err);
                  return done(err, user);
              });
          } else {
              return done(err, user);
          }
      });
  }
));

module.exports = passport;