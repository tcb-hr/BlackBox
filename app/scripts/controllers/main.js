'use strict';

var app = angular.module('feedApp');

app.directive('slidePanel', ['$swipe', function($swipe) { // MOVE DIRECTIVES TO A SEPARATE FILE?
  return {
    restrict: 'EA',
    link: function(scope, ele, attrs, ctrl) {
      var startX, pointX;
      $swipe.bind(ele, {
        'start': function(coords) {
          startX = coords.x;
          pointX = coords.y;
        }, 'move': function(coords) {
          var delta = coords.x - pointX;
        }, 'end': function(coords) {
        }, 'cancel': function(coords) {
        }
      });
    }
  };
}]);

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

app.factory('socket', function($rootScope) { // MOVE FACTORIES TO A SEPARATE FILE?
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
  // BREAK SOME OF THESE PIECES BELOW INTO SEPARATE CONTROLLERS?

  socket.on('init', function(data) {
    console.log('Socket connection established.');
  });

  $scope.messageFilter = function(chat) {
    for(var i = 0; i < $scope.messageTypes.length; i++) {
      if((chat.type === $scope.messageTypes[i].dbLabel) && $scope.messageTypes[i].show) {
        return true;
      }
    }
    return false;
  };

  $scope.zones = [{
    label: '1',
    show: true
    }, {
      label: '2',
      show: true
    }, {
      label: '3',
      show: true
    }, {
      label: '4',
      show: true
    }, {
      label: '5',
      show: true
    }, {
      label: '6',
      show: true
    }, {
      label: '7',
      show: true
  }];

  $scope.messageTypes = [{
      label: 'Chats',
      show: true
    }, {
      label: 'Instagram',
      show: true,
    }, {
      label: 'Courier check-in',
      dbLabel: 101,
      show: true
    }, {
      label: 'Courier check-out',
      dbLabel: 102,
      show: true
    }, {
      label: 'Job created',
      dbLabel: 103,
      show: true
    }, {
      label: 'Job cancelled',
      dbLabel: 104,
      show: true
    }, {
      label: 'Job edited',
      dbLabel: 105,
      show: true
    }, {
      label: 'Job ready',
      dbLabel: 106,
      show: true
    }, {
      label: 'Job assigned',
      dbLabel: 107,
      show: true
    }, {
      label: 'Job picked', 
      dbLabel: 108,
      show: true
    }, {
      label: 'Job delivered',
      dbLabel: 109,
      show: true
    }, {
      label: 'Job complete',
      dbLabel: 110,
      show: true
    }, {
      label: 'Job late',
      dbLabel: 111,
      show: true
  }];

  $scope.toggle = function () {
    console.log('show', this.show);
    this.show = !this.show;
    console.log('show', this.show);
  };

  socket.on('newMessage', function(data) {
    var newChat = data['data'][0];
    var idOfLastItem = $scope.chats[$scope.chats.length-1]._id;
    if(idOfLastItem !== newChat._id) {
      $scope.chats.push(newChat);
      console.log('new message added');
    }
  });

  $scope.showPanelLeft = false;
  $scope.togglePanelLeft = function() {
    $scope.showPanelLeft = ($scope.showPanelLeft) ? false : true;
  };

  $scope.showPanelRight = false;
  $scope.togglePanelRight = function() {
    $scope.showPanelRight = ($scope.showPanelRight) ? false : true;
  };

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
    console.log('GET success!');
    $scope.chats = chats;
  }).error(function(data, status, headers, config) {
    console.log('GET error!', '\ndata:', data, '\nstatus:', status, '\nheaders:', headers, '\nconfig:', config);
  });

  $scope.doneUp = function() {
    // console.log('doneUp', arguments)
    $http.get('/download').success(function() {
      console.log('GET success!');
    }).error(function(data, status, headers, config) {
      console.log('GET error!', '\ndata:', data, '\nstatus:', status, '\nheaders:', headers, '\nconfig:', config);
    });
  };

    // // $http.get('/upload').success(
    //   $http.get('/download').success( function(){
    //   console.log('so let it be written');
    // });//);
  // This function called if user makes a dropdown selection.
  // User's dropdown selection will be added to the composition field.
  $scope.composeCanned = function() {
    console.log('composeCanned invoked');
    var composeField = document.getElementById('composeField');
    var cannedSelect = document.getElementById('cannedSelect');
    if(composeField.value === '') {
      composeField.value = cannedSelect.options[cannedSelect.selectedIndex].text;
    } else {
      composeField.value += ' ' + cannedSelect.options[cannedSelect.selectedIndex].text;
    }
  };

  $scope.sendChat = function(chat) {
    console.log('sendChat invoked');
    $http.post('/api/chat', {
      user: chat.name,
      body: chat.body,
      image: ''
    }).success(function() {
      console.log('POST success!');
      $http.get('/api/chat').success(function(chats) {
        console.log('GET success!');
        $scope.chats = chats;
      }).error(function(data, status, headers, config) {
        console.log('GET error!', '\ndata:', data, '\nstatus:', status, '\nheaders:', headers, '\nconfig:', config);
      });
      // Reset canned-selector & clear composition field.
      document.getElementById('cannedSelect').value = '0';
      document.getElementById('composeField').value = '';
    }).error(function(data, status, headers, config) {
      console.log('POST error!', '\ndata:', data, '\nstatus:', status, '\nheaders:', headers, '\nconfig:', config);
    });
    // THESE LINES BELOW ARE TEMPORARILY DUPLICATED FROM POST-SUCCESS ABOVE UNTIL POST ERROR CORRECTED. ************
    // Reset canned-message-selector & clear composition field.
    document.getElementById('cannedSelect').value = '';
    document.getElementById('composeField').value = '';
  };
  
  $scope.layer;
  $scope.map;
  $scope.dropMarker;
  $scope.pickMarker;

  $scope.createMap = function() {
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

    $scope.pickMarker = L.marker([37.8, -120], { icon: greenMarker }).addTo($scope.map);
    $scope.dropMarker = L.marker([37.7, -122.4], { icon: redMarker }).addTo($scope.map);

    $("#map").height($(window).height());
    $scope.map.invalidateSize();
  
    $('#map').click(function() {
      $('#map').hide();
    });
    $('#map').hide();

    $('#pic').height($(window).height());
    $('#pic').click(function() {
      $('#pic').hide();
    });
  };

  $scope.hidePic = function() {
    $('#pic').css('display', 'none');
  };

  $scope.showMapOrPic = function(chat) {
    console.log(chat);
    if(chat.image !== undefined) {
      $('#pic').css('display', 'block');
      $('#pic').css('background', 'url(' + chat.image + ') no-repeat center center');
    }
    if(chat.pickCoordinates !== undefined) {
      var pickLat = JSON.parse(chat.pickCoordinates).lat;
      var pickLng = JSON.parse(chat.pickCoordinates).lng;
      var dropLat = JSON.parse(chat.dropCoordinates).lat;
      var dropLng = JSON.parse(chat.dropCoordinates).lng;
      $scope.map.panTo(new L.LatLng(dropLat, dropLng));
      $scope.dropMarker.setLatLng([dropLat, dropLng]);
      if((pickLat === dropLat) && (pickLng === dropLng)) {
        $scope.pickMarker.setLatLng([0,0]);
      } else {
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
