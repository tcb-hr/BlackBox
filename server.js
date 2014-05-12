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
var Chat = require('./lib/models/chat');

io.sockets.on('connection', function (socket) {
  socket.emit('init');
  
  var d = new Date();
  d.setDate(d.getDate());
  d.setTime(d.getTime()-d.getHours()*3600*1000-d.getMinutes()*60*1000);
  
  var chatStream = Chat.chatModel.find().where('timestamp').gt(d).tailable().stream();
  chatStream.on('data', function (chat) { 
    socket.emit('newMessage', {data: chat});
  }).on('error', function(err) {
    return res.send(err);
  }).on('end', function (arg){
    console.log('arg!', arg);
  });

  // var otherStream = Chat.chatModel.find().tailable().stream();
  // otherStream.on('data', function (chat) {
  //   socket.emit('newMessage', {data:chat});
  // });


  // fs.watchFile('/var/lib/mongodb/fullstack-dev.0', function(curr, prev){
  //   if(curr.mtime.getTime() !== prev.mtime.getTime()){  
  //     Chat.chatModel.find().sort({_id: -1}).limit(3).exec(function(err, chatFromDb){
  //       if(err){
  //         console.log(err);
  //       }  
  //       socket.broadcast.emit('newMessage', {data: chatFromDb[0]})
  //       .on('error', function(err) {
  //         console.log(err);
  //       });
  //       socket.emit('newMessage', {data: chatFromDb[0]});
  //     });
  //   }
  // });
  socket.on('newChat', function (chat) {
    var newChat = new Chat.chatModel(chat);
    newChat.provider = 'local';
    newChat.save(function(err) {
      if (err) {
        console.log('err', err);
      } else {
        // Chat.chatModel.find().limit(1).exec(function(err, chatFromDb){
        //   if(err){
        //     console.log(err);
        //   }  
        //   socket.emit('newMessage', {data: chatFromDb[0]});
        });
      }
    });
  });
});



//module.exports.io = io;

// Expose app
exports = module.exports = app;
