'use strict';

angular.module('feedApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('/api/chat').success(function(chats) {
      $scope.chats = chats;
    });

    $scope.sendChat = function(){
      $http.post('/api/chat', {user:'Ed Lover', body:'he is not Dr Dre'});
    }

  });
