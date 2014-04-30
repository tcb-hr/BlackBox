'use strict';

var app = angular.module('feedApp');

app.controller('MainCtrl', function($scope, $http) {

  $scope.glued = true;

  $http.get('/api/chat').success(function(chats) {
    $scope.chats = chats;
  });

  $scope.sendChat = function(chat){

    $http.post('/api/chat',
      {user:chat.name, body:chat.body});

    $http.get('/api/chat').success(function(chats) {
      $scope.chats = chats;
    });

    // var body = document.body;
    // body.scrollTop = body.scrollHeight + 44;

    var feed = document.getElementById('feed');
    feed.scrollTop = feed.scrollHeight + 44;
    console.log(feed);
    console.log(feed.scrollHeight);
    console.log(feed.scrollTop);
    debugger;

  };

});
