'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// Populate empty DB with sample data
require('./lib/config/dummydata');

// Passport Configuration
var passport = require('./lib/config/passport');

// Setup Express
var app = express();
require('./lib/config/express')(app);
require('./lib/routes')(app);

// Start server
var server = app.listen(config.port, config.ip, function () {
  console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
});

// Sockets

var io = require('socket.io').listen(server);

io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging

// enable all transports (optional if you want flashsocket support, please note that some hosting
// providers do not allow you to create servers that listen on a port different than 80 or their
// default port)
io.set('transports', [
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);


var Chat = require('./lib/models/chat');
var Racer = require('./lib/models/racer');
var Thing = require('./lib/models/thing');

io.sockets.on('connection', function (socket) {
  socket.emit('init');
  // socket.emit('ping', { message: 'Hello from server ' + Date.now() });
  // socket.on('pong', function (data) {
  //   console.log(data.message);
  // });
  
  socket.on('hello', function(){
    var now = new Date(new Date().getTime() - (2 * 60 * 60 * 1000));
    var chatStream = Chat.chatModel.find({timestamp: {$gte: now}}).tailable().stream();
    chatStream.on('data', function (chat) { 
      socket.emit('newMessage', {data: chat});
    }).on('error', function(err) {
      console.log('chatStream err', err);
    }).on('end', function (arg){
      // console.log('arg!', arg);
    });
  })

  socket.on('standings', function(){
    console.log('hello standings');
    Racer.racerModel.find({}, function (err, chat){
      console.log('standarr', chat)
      socket.emit('newStanding', chat)
    });
    // racerStream.on('data', function (racer) { 
    //   socket.emit('newStanding', {data: racer});
    // }).on('error', function(err) {
    //   console.log('racerStream err', err);
    // }).on('end', function (arg){
    //   // console.log('arg!', arg);
    // });
  })

  socket.on('sched', function(){
    // console.log('hello schedule');
    var now = new Date(new Date().getTime() - (1 * 60 * 60 * 1000));
    var thingStream = Thing.model.find({timestamp: {$gte: now}}).stream();
    // var thingStream = Thing.model.find().stream();
    thingStream.on('data', function (thing) { 
      // console.log('things be streamin', thing);
      socket.emit('newSched', {data: thing});
    }).on('error', function(err) {
      console.log('thingStream err', err);
    }).on('end', function (arg){
      // console.log('arg!', arg);
    });
  })

  socket.on('fetch', function(chat){
    console.log('fetched', chat);
    // console.log('fetched chat is thus: ', chat);
    var fetchStream = Chat.chatModel.find().where('_id').lt(chat._id).sort('-timestamp').limit(25).stream();
    fetchStream.on('data', function (chatter) {
      // console.log('chatback', chatter);
      socket.emit('newMessage', {data: chatter});
    }).on('error', function(err) {
      console.log('fetchStream err', err);
    }).on('end', function (arg){
      // console.log('arg!', arg);
    });    
  })

  socket.on('newChat', function (chat) {
    var newChat = new Chat.chatModel(chat);
    newChat.provider = 'local';
    newChat.save(function(err) {
      if (err) {
        console.log('err', err);
      } 
    });
  });
});



//module.exports.io = io;

// Expose app
exports = module.exports = app;
