'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    chat = require('./controllers/chat'),
    // flow = require('./controllers/upload.js')('tmp/'),
    session = require('./controllers/session'),
    middleware = require('./middleware'),
    instagram = require('./config/instagram'),
    multipart = require('connect-multiparty'),
    passport = require('passport'),
    // fs = require('fs'),
    multipartMiddleware = multipart();
/**
 * Application routes
 */
module.exports = function(app) {

  app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
 });
  //chat routes  
  app.route('/api/chat')
    .all(middleware.isLoggedIn)
    .get(api.chat)
    .post(chat.create);

  app.route('/api/twinjet')
    .post(chat.twinjet);
    
  //user routes
  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword)
    .get(users.allUsers);
  app.route('/api/users/me')
    .get(users.me)
    .post(users.changeSettings);
  app.route('/api/users/:id')
    .get(users.show);
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
  app.route('/avatars')
    .post(users.changeAvatar); 

  //passport routes
  app.get('/api/me', passport.authenticate('bearer', { session: false }),
    function(req, res) {
      res.json(req.user);
  });
  app.get('/api/google', passport.authenticate('google'));
  app.get('/api/google/callback', 
    passport.authenticate('google', { 
      successRedirect: '/',
      failureRedirect: '/login' 
  }));

  //session routes
  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);
 // Instagram Routes
  app.get('/api/instagram/callback', function(request, response){
    // console.log('GET request', request);
    instagram.subscriptions.handshake(request, response);
  });
  app.post('/api/instagram/callback', function(request, response){
    var data = request.body;
    // console.log('hello instagram', data);
    data.forEach(function(tag){
    console.log('gram tag', tag);   
      chat.gram(tag.object_id, request, response); 
    });
    response.end();
  });
  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });
  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};
