'use strict';

/**
 * Custom middleware used by the application
 */
module.exports = {

  /**
   *  Protect routes on your api from unauthenticated access
   */
  auth: function auth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.send(401);
  },

  /**
   * Set a cookie for angular so it knows we have an http session
   */
  setUserCookie: function(req, res, next) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.userInfo));
    }
    next();
  },
  isLoggedIn: function(req, res, next) {
    // console.log('he cool?');
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
      // console.log('he ai-ight');
      return next();
    }
    // if they aren't redirect them to the home page
    res.redirect('/');
  }
};