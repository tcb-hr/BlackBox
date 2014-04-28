'use strict';

angular.module('feedApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('/api/chat').success(function(chats) {
      $scope.chats = chats;
    });
  });
