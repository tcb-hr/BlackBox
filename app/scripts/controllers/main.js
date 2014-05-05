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

app.factory('socket', function($rootScope) {
	var socket = io.connect();
	return {
		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},
		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
});

app.controller('MainCtrl', function($scope, $http, $window, socket) {
  socket.on('init', function(data){
    console.log('Socket connection established');
  });

  socket.on('newMessage', function(data){
    var newChat = data['data'][0];  
    console.log('newChat', newChat);
    $scope.chats.push(newChat);
  });

  var toolsVisible = false;
  $scope.showTools = function() {
    return toolsVisible;
  };
  $scope.toggleTools = function() {
    var feed = $window.document.getElementById('feed');
    if(toolsVisible === true) {
      toolsVisible = false;
      feed.style.bottom = '44px';
      feed.scrollTop = feed.scrollHeight + 44;
    } else {
      toolsVisible = true;
      feed.style.bottom = (44 + 40 * 3) + 'px'; // 3 tools
      feed.scrollTop = feed.scrollHeight + (44 + 40 * 3); // 3 tools.
    }
  };

  $http.get('/api/chat').success(function(chats) {
    $scope.chats = chats;
  });


  $scope.sendChat = function(chat) {
    $http.post('/api/chat', {
      user: chat.name,
      body: chat.body,
      image: ''
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
      zoom: 14
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

    $('#pic').height($(window).height());
    $('#pic').click(function(){
      $('#pic').hide();
    });
  };

  $scope.hidePic = function(){
    $('#pic').css('display', 'none');
  }
 
  $scope.showMapOrPic = function(chat){
    console.log(chat);
    if(chat.image !== undefined){
      $('#pic').css('display', 'block');
      $('#pic').css('background', 'url(' + chat.image + ') no-repeat center center');
    }
    if(chat.pickCoordinates !== undefined){
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
    }
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
