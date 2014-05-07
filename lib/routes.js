'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    chat = require('./controllers/chat'),
    flow = require('./controllers/upload.js')('tmp/'),
    session = require('./controllers/session'),
    middleware = require('./middleware'),
    instagram = require('./config/instagram'),
    multipart = require('connect-multiparty'),
    passport = require('passport'),
    fs = require('fs'),
    multipartMiddleware = multipart();
/**
 * Application routes
 */
module.exports = function(app) {
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
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  //passport routes
  app.get('/api/me', passport.authenticate('bearer', { session: false }),
    function(req, res) {
      res.json(req.user);
  });
  // Redirect the user to Google for authentication.  When complete, Google
  // will redirect the user back to the application at
      // /auth/google/return
  // app.get('/auth/google', passport.authenticate('google'));
  // // Google will redirect the user to this URL after authentication.  Finish
  // // the process by verifying the assertion.  If valid, the user will be
  // // logged in.  Otherwise, authentication has failed.
  // app.get('/auth/google/return', 
  //   passport.authenticate('google', { 
  //     successRedirect: '/',
  //     failureRedirect: '/login' 
  // }));

  // app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
  // // the callback after google has authenticated the user
  // app.get('/auth/google/callback',
  //   passport.authenticate('google', {
  //     successRedirect : '/',
  //     failureRedirect : '/login'
  // }));

  //session routes
  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);
 // Instagram Routes
  app.get('/callback', function(request, response){
    console.log('GET request', request);
    instagram.subscriptions.handshake(request, response);
  });
  app.post('/callback', function(request, response){
    var data = request.body;
    data.forEach(function(tag){   
      chat.gram(tag.object_id, request, response); 
    });
    response.end(); 
 });
  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });
  //upload routes
  var stream;
  var iden;
  var file;

  app.post('/upload', multipartMiddleware, function(req, res){ 
    flow.post(req, function(status, filename, original_filename, identifier){
      console.log('POST', status, original_filename, identifier);
      console.log('file is ', file)
      res.send(200, {
        // NOTE: Uncomment this funciton to enable cross-domain request.
        //'Access-Control-Allow-Origin': '*'
      });
    });
  });
  // Handle cross-domain requests
  // NOTE: Uncomment this function to enable cross-domain request.
  /*
    app.options('/upload', function(req, res){
    console.log('OPTIONS');
    res.send(true, {
    'Access-Control-Allow-Origin': '*'
    }, 200);
    });
  */

  // Handle status checks on chunks through Flow.js
  app.get('/upload', function(req, res){
    console.log('hello upload get')
    flow.get(req, function(status, filename, original_filename, identifier){
      iden = identifier;
      file = original_filename;
      stream = fs.createWriteStream('./upload/'+file);
      console.log('GET', status);
      res.send(200, (status == 'found' ? 200 : 404));
    });
  });
  
  
  app.get('/download', function(req, res){
    console.log(iden, 'we writin')
    flow.write(iden, stream);
  });
  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
  // Handle uploads through Flow.js
};
