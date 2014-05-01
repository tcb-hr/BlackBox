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
  
  $scope.layer;
  $scope.map;
  $scope.marker;


  $scope.createMap = function(){
    $scope.layer = new L.StamenTileLayer("toner");
    $scope.map = new L.Map("map", {
      center: new L.LatLng(37.7, -122.4),
      zoom: 12
    });
    $scope.map.addLayer($scope.layer);
    $scope.marker = L.marker([37.7, -122.4]).addTo($scope.map);
    
    $("#map").height($(window).height());
    $scope.map.invalidateSize();
    
    $('#map').click(function(){
      $('#map').hide();
    });
    $('#map').hide();
  };


  /* Sample address input
   "drop_address": {
              "city": "San Francisco",
              "name": "Haus",
              "zip": "94109-8140",
              "floor": "",
              "state": "CA",
              "street_address": "565 Ellis St"
          }
  */ 
  $scope.showMap = function(latLng){
    if(latLng !== ''){
      $scope.marker.setLatLng([50, 50]); //change to chat.latLng
      console.log(chat);
      $('#map').show();
    }
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
