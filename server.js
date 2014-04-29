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

// Instagram
var Instagram = require('instagram-node-lib');
Instagram.set('client_id', 'ce171905d26343f4b73d255d2b2f0087');
Instagram.set('client_secret', '033e27ced8cc432fac275aa5c4c046a8');
Instagram.set('callback_url', 'http://localhost:8000/callback');
Instagram.set('redirect_uri', 'http://localhost:8000');

app.get('/callback', function(req, res){
  var handshake =  Instagram.subscriptions.handshake(req, res);
});

app.post('/callback', function(req, res) {
  console.log('callback post');
  var data = req.body;
  // Grab the hashtag "tag.object_id"
  // concatenate to the url and send as a argument to the client side
  data.forEach(function(tag) {
    var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id=CLIENT_ID';
    sendMessage(url);
  });
  res.end();
});

/**
 * Send the url with the hashtag to the client side
 * to do the ajax call based on the url
 * @param  {[string]} url [the url as string with the hashtag]
 */
function sendMessage(url) {
  io.sockets.emit('show', { show: url });
}

io.sockets.on('connection', function (socket) {
  Instagram.tags.recent({
    name: 'tcbcourier',
      complete: function(data) {
        socket.emit('instagramFeed', { instagramFeed: data });
      }
  });
});

// Expose app
exports = module.exports = app;