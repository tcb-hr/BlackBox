'use strict';

var app = angular.module('feedApp');

app.controller('MainCtrl', function($scope, $http) {

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

app.filter('searchFor', function(){
  return function(arr, searchString){
    if(!searchString){
      return arr;
    }
    var result = [];
    console.log(arr)
    searchString = searchString.toLowerCase();
    angular.forEach(arr, function(chat){

      if(chat.body && chat.body.toLowerCase().indexOf(searchString) !== -1){
        result.push(chat);
      }
    });
    return result;
  };
});
