'use strict';

var app = angular.module('feedApp');

app.directive('scrollBottom', function($window) { // MOVE DIRECTIVES TO SEPARATE FILE?

  var link = function(){
    var feed = $window.document.getElementById('feed');
    feed.scrollTop = feed.scrollHeight + 44;
  };

  return {
    link: link
  };

});

app.controller('MainCtrl', function($scope, $http) {

  $http.get('/api/chat').success(function(chats) {
    $scope.chats = chats;
  });

  $scope.sendChat = function(chat) {

    $http.post('/api/chat', {
      user: chat.name,
      body: chat.body
    });

    $http.get('/api/chat').success(function(chats) {
      $scope.chats = chats;
    });

  };

});
