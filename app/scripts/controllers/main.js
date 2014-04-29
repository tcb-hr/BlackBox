'use strict';

angular.module('feedApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('/api/chat').success(function(chats) {
      $scope.chats = chats;
    });

    $scope.sendChat = function(chat){
      console.log($scope.chat)
      $http.post('/api/chat', 
        {user:chat.name, body:chat.body});
      $http.get('/api/chat').success(function(chats) {
      $scope.chats = chats;
      });
    }

  });
