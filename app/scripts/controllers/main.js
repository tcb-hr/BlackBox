'use strict';

var app = angular.module('feedApp');

app.directive('scrollBottom', function($window) {
  function link(scope, el){
    var feed = $window.document.getElementById('feed');
    feed.scrollTop = feed.scrollHeight + 44;
    feed.scrollTop = 9999;
  }
  return {
    link: link
  };
});

app.controller('MainCtrl', function($scope, $http, $document, $window, $location, $rootScope, $anchorScroll) {

  // $scope.gotoBottom = function (){
  //   // set the location.hash to the id of
  //   // the element you wish to scroll to.
  //   $location.hash('bottom');

  //   // call $anchorScroll()
  //   $anchorScroll();
  // };

  $http.get('/api/chat').success(function(chats) {
    $scope.chats = chats;
  });

  $scope.sendChat = function(chat){

    $http.post('/api/chat',
      {user:chat.name, body:chat.body});

    $http.get('/api/chat').success(function(chats) {
      $scope.chats = chats;

      $location.hash("")
      // var feed = document.getElementById('feed');
      feed.scrollTop = feed.scrollHeight + 44;
      feed.scrollTop = 9999;
      // debugger;

    })

  };

});
