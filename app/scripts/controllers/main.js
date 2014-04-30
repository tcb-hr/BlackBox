'use strict';

var app = angular.module('feedApp');

app.controller('MainCtrl', function($scope, $http) {

  $scope.glued = true;

  $http.get('/api/chat').success(function(chats) {
    $scope.chats = chats;
  });

  // $scope.glued = true;

  $scope.sendChat = function(chat){
    // console.log($scope.chat);
    $http.post('/api/chat',
      {user:chat.name, body:chat.body});

    $http.get('/api/chat').success(function(chats) {
      $scope.chats = chats;
    });
    
    var body = document.body;
    body.scrollTop = body.scrollHeight + 44;

  };

});
