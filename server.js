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

io.sockets.on('connection', function (socket) {
  socket.emit('init');
  fs.watchFile('/var/lib/mongodb/fullstack-dev.0', function(curr, prev){
    if(curr.mtime.getTime() !== prev.mtime.getTime()){  
      console.log('Database has been updated')
      var Chat = require('./lib/models/chat');
      Chat.chatModel.find().sort({_id: -1}).limit(1).exec(function(err, chat){
        if(err){
          console.log(err);
        }  
        socket.emit('newMessage', {data: chat});
      });
     }
  });
});


//module.exports.io = io;

// Expose app
exports = module.exports = app;
