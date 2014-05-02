'use strict';

var app = angular.module('feedApp');

app.directive('scrollBottom', function($window) { // MOVE DIRECTIVES TO A SEPARATE FILE?

  var scrollBottomWrap = function() {

    var scrollToBottom = function() {
      var feed = $window.document.getElementById('feed');
      feed.scrollTop = feed.scrollHeight + 44;
    };
    scrollToBottom();

    $window.addEventListener('resize', function() {
      scrollToBottom();
    });

  };

  return {
    link: scrollBottomWrap
  };

});

app.controller('MainCtrl', function($scope, $http) {

  $http.get('/api/chat').success(function(chats) {
    $scope.chats = chats;
  });

  $scope.sendChat = function(chat) {

    $http.post('/api/chat', {
      user: chat.name,
      body: chat.body,
      image: ""
    });

    $http.get('/api/chat').success(function(chats) {
      $scope.chats = chats;
    });

  };
  
  $scope.layer;
  $scope.map;
  $scope.dropMarker;
  $scope.pickMarker;


  $scope.createMap = function(){
    $scope.layer = new L.StamenTileLayer("toner");
    $scope.map = new L.Map("map", {
      center: new L.LatLng(37.7, -122.4),
      zoom: 12
    });
    $scope.map.addLayer($scope.layer);

    //drop Location
    var redMarker = L.AwesomeMarkers.icon({
      icon: 'coffee',
      markerColor: 'red'
    });

    //pick Location
    var greenMarker = L.AwesomeMarkers.icon({
      icon: 'coffee',
      markerColor: 'green'
    });

    $scope.pickMarker = L.marker([37.8, -120], {icon: greenMarker}).addTo($scope.map); 
    $scope.dropMarker = L.marker([37.7, -122.4], {icon: redMarker}).addTo($scope.map);

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
  $scope.showMap = function(chat){
    console.log(chat);
    var pickLat = JSON.parse(chat.pickCoordinates).lat;
    var pickLng = JSON.parse(chat.pickCoordinates).lng;
    var dropLat = JSON.parse(chat.dropCoordinates).lat;
    var dropLng = JSON.parse(chat.dropCoordinates).lng; 
    $scope.map.panTo(new L.LatLng(dropLat, dropLng));
    $scope.dropMarker.setLatLng([dropLat, dropLng]);
    if((pickLat === dropLat) && (pickLng === dropLng)){
      $scope.pickMarker.setLatLng([0,0]);
    }else{
      $scope.pickMarker.setLatLng([pickLat, pickLng]);
    }
    $('#map').show();
  };

});
  


app.filter('searchFor', function() {
  return function(arr, searchString) {
    if(!searchString) {
      return arr;
    }
    var result = [];
    searchString = searchString.toLowerCase();
    angular.forEach(arr, function(chat) {
      if(chat.body && chat.body.toLowerCase().indexOf(searchString) !== -1) {
        result.push(chat);
      }
    });
    return result;
  };
});
