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

passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:8000', //change this for deployment
    realm: 'http://localhost:8000',
  },
  function(identifier, profile, done) {
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
  }
));

// passport.use(new GoogleStrategy({
//     returnURL: 'http:localhost:8000', //change this for deployment
//     realm: 'http://localhost:8000',
//     clientID        : configAuth.googleAuth.clientID,
//     clientSecret    : configAuth.googleAuth.clientSecret,
//     callbackURL     : configAuth.googleAuth.callbackURL,
//   },
//   function(token, refreshToken, profile, done) {
//   // make the code asynchronous
//   // User.findOne won't fire until we have all our data back from Google
//   process.nextTick(function() {
//         // try to find the user based on their google id
//         User.findOne({ 'google.id' : profile.id }, function(err, user) {
//             if (err)
//                 return done(err);
//             if (user) {
//                 // if a user is found, log them in
//                 return done(null, user);
//             } else {
//                 // if the user isnt in our database, create a new user
//                 var newUser          = new User();
//                 // set all of the relevant information
//                 newUser.google.id    = profile.id;
//                 newUser.google.token = token;
//                 newUser.google.name  = profile.displayName;
//                 newUser.google.email = profile.emails[0].value; // pull the first email
//                 // save the user
//                 newUser.save(function(err) {
//                     if (err)
//                         throw err;
//                     return done(null, newUser);
//                 });
//             }
//         });
//     });
//   }));


module.exports = passport;
