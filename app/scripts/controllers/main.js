'use strict'

var app = angular.module('feedApp');

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

app.directive('slidePanel', ['$swipe', function($swipe) { // MOVE DIRECTIVES TO A SEPARATE FILE?
  return {
    restrict: 'EA',
    link: function(scope, elem, attrs, ctrl) {
      var startX, pointX;
      $swipe.bind(elem, {
        'start': function(coords) {
          startX = coords.x;
          pointX = coords.y;
        },
        'move': function(coords) {
          var delta = coords.x - pointX;
        },
        'end': function(coords) {
        },
        'cancel': function(coords) {
        }
      });
    }
  };
}]);

app.directive('scrollBottom', function($window) { // MOVE DIRECTIVES TO A SEPARATE FILE?
  var scrollBottomWrap = function() {
    var scrollToBottom = function() {
      var feed = document.getElementById('feed');
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

var feedbackPerLength = function(length) {
  var composeField = document.getElementById('composeField');
  var limit = composeField.attributes.getNamedItem('char-limit').value;
  switch(true) {
    case (limit <= length):
      composeField.classList.add('danger');
      break;
    case (limit - length <= 20):
      composeField.classList.remove('danger');
      composeField.classList.add('warning');
      break;
    default:
      composeField.classList.remove('danger');
      composeField.classList.remove('warning');
  }
};

app.directive('charLimit', function() { // MOVE DIRECTIVES TO A SEPARATE FILE?
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      var limit = attrs.charLimit;
      elem.bind('keyup', function(event) {
        var length = elem.val().length;
        feedbackPerLength(length); // Color the field if text too long.
      });
      elem.bind('keypress', function(event) {
        if(elem.val().length >= limit) {
          if(event.keyCode !== 8) { // Prevent non-backspace keypresses if length exceeds limit.
            event.preventDefault();
          }
        }
      });
    }
  };
});

app.controller('MainCtrl', function($scope, $http, $window, socket) {
  // BREAK SOME OF THESE PIECES BELOW INTO SEPARATE CONTROLLERS?

  // This function is called if the user makes a dropdown selection.
  $scope.composeCanned = function(chat) {
    // Add user's dropdown selection to the composition field.
    if(chat.body === undefined) {
      chat.body = $scope.cannedModel;
    } else {
      chat.body += ' ' + $scope.cannedModel;
    }
    feedbackPerLength(chat.body.length); // Color the field if text too long.
  };

  socket.on('init', function(data) {
    console.log('Socket connection established.');
  });

  $scope.messageFilter = function(chat) {
    for(var i = 0; i < $scope.settings.messageTypes.length; i++) {
      if((chat.type === $scope.settings.messageTypes[i].dbLabel) && $scope.settings.messageTypes[i].show) {
        return true;
      }
    }
    return false;
  };

  $scope.toggleZones = function(){
    $scope.displayZones = !$scope.displayZones;
    $scope.displayMessageTypes = false;
    $scope.displayUsers = false;
  }

  $scope.toggleMessageTypes = function(){
    $scope.displayMessageTypes = !$scope.displayMessageTypes;
    $scope.displayZones = false;
    $scope.displayUsers = false;
  }

  $scope.toggleUsers = function(){
    $scope.displayUsers = !$scope.displayUsers;
    $scope.displayZones = false;
    $scope.displayMessageTypes = false;
  }
  $scope.selectAllZones = true;
  $scope.selectAllMessageTypes = true;
  $scope.selectAllUsers = true;

  $scope.selectAll = function(arr){
    if(arr === $scope.settings.zones){
      $scope.selectAllZones = !$scope.selectAllZones;
      var value = $scope.selectAllZones;
    }
    if(arr === $scope.settings.messageTypes){
      $scope.selectAllMessageTypes = !$scope.selectAllMessageTypes;
      var value = $scope.selectAllMessageTypes;
    }
    if(arr === $scope.settings.users){
      $scope.selectAllUsers = !$scope.selectAllUsers;
      var value = $scope.selectAllUsers;
    }
    for(var i=0; i<arr.length; i++){
      arr[i].show = value; 
    }
  }

  $scope.settings = {
    zones: [{
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
  }],
  
  messageTypes: [{
    label: 'Chats',
    dbLabel: 200,
    show: true
  }, {
    label: 'Instagram',
    dbLabel: 300,
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
  }],

  users: []
  }; 

//  $scope.showUsers = false;

  $scope.configureUserSettings = function(){
  // sets up settings for a logged in user
    $http.get('/api/users/me').success(function(user) {
      $scope.user = user || 'guest'; 
      if(user.settings === undefined){
        console.log('new user or guest');
        $http.get('/api/users').success(function(currentUsers){
          var userFilter = [];
          for(var i=0; i<currentUsers.length; i++){
            userFilter.push({name: currentUsers[i].name, show: true});
          }
          $scope.settings.users = userFilter;
          if($scope.user !== 'guest'){
            $http.post('/api/users/me', {
              propertyValue: $scope.settings,
              propertyKey: 'settings',
              userId: $scope.user._id
            }).success(function() {
              console.log('User settings updated in db');
            });
          }
        });
      } else{
        // check to see if their user list is up to date
        $scope.settings = user.settings;
        $http.get('/api/users').success(function(currentUsers){
          var updated = false;
          for(var i=0; i<currentUsers.length; i++){
            user = currentUsers[i].name;
            var found = false;
            for(var j=0; j<$scope.settings.users.length; j++){
              if($scope.settings.users[j].name === user){
                found = true;
                updated = true;
              }
            }
            if(found === false){
              $scope.settings.users.push({name: user, show: true}); 
            }
          }
         if(updated){
           $http.post('/api/users/me', {
             propertyValue: $scope.settings, 
             propertyKey: 'settings',
             userId: $scope.user._id
           }).success(function() {
             console.log('User people prefernces updated');
           }); 
         }
      });
    }
    }).error(function(data, status, headers, config) {
      console.log('GET error!', '\ndata:', data, '\nstatus:', status, '\nheaders:', headers, '\nconfig:', config);
    });  
  };
  
  $scope.updateFilters = function(){
    console.log('change');
  }

  $scope.toggle = function () {
    // console.log('show', this.show);
    this.show = !this.show;
    // console.log('show', this.show);
  };

  $scope.chats = {};

  var checkChats = function(chat){
    $scope.chats[chat._id] = chat;
  };

 

  socket.on('newMessage', function(data) {
    console.log('fishon', data);
    var newChat = data.data;
    checkChats(newChat);
  });

  socket.on('dbUpdate', function(data) {
    console.log('free-basing DXM', data);
    var newChat = data.data[0];
    checkChats(newChat);
  });

  $scope.sendChat = function(chat) {
    if(!isChatValid(chat)) {
      console.log('Invalid chat, overriding "send".');
      return;
    }
    socket.emit('newChat', {
      user: $scope.user.name,
      body: chat.body,
      image: '',
      type: 200
    });
    resetChatForm(chat);
  };

  $scope.showPanelLeft = false;
  $scope.togglePanelLeft = function() {
    $scope.showPanelLeft = ($scope.showPanelLeft) ? false : true;
    if($scope.user !== 'guest'){
      $http.post('/api/users/me', {
        propertyKey: 'settings',
        propertyValue: $scope.settings,
        userId: $scope.user._id
      }).success(function() {
        console.log('POST success!');
      });
    }
  }

  $scope.showPanelRight = false;
  $scope.togglePanelRight = function() {
    $scope.showPanelRight = ($scope.showPanelRight) ? false : true;
  };

  $scope.loadAvatar = function(){
    $http.get('/api/users/me').success(function(user) {
      var str = "url('" + user.avatar + "')";
      $('#avatarDisplay').css('background-image', str);

    }).error(function(data, status, headers, config) {
      console.log('GET error!', '\ndata:', data, '\nstatus:', status, '\nheaders:', headers, '\nconfig:', config);
    });
  }

  var previewPhoto = function(file, canvas){
    var image = new Image;
    var reader = new FileReader();
    reader.onload = function(e){
      image.src = e.target.result;

      //scale image
      var MAX_WIDTH = 80;
      var MAX_HEIGHT = 80;
      var width = image.width;
      var height = image.height;
      if(width > height){
        if(width > MAX_WIDTH){
           height *= MAX_WIDTH / width;
           width = MAX_WIDTH;
        }
      } else {
        if(height > MAX_HEIGHT){
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, width, height);
    }
    reader.readAsDataURL(file);
  };

  $scope.previewAvatar = function(){
    var file = document.getElementById('avatarInput').files[0];
    var canvas = document.getElementById('avatarCanvas');
    previewPhoto(file, canvas);
  }

  $scope.saveAvatar = function(){
    var encoding = document.getElementById("avatarCanvas").toDataURL();
    console.log('save encoding', encoding);
    $http.post('/api/users/me', {
      propertyValue: encoding,
      propertyKey: 'avatar',
      userId: $scope.user._id
    }).success(function() {
      console.log('Image saved to database');
    });
  }

  $scope.cancelAvatar = function(){
    $('#avatarImage').attr('src', '');
  }

 $scope.toggleStats = function(){
    $scope.showStats = !$scope.showStats;
    $scope.showAvatar = false;
  }

  $scope.toggleAvatar = function(){
    $scope.showAvatar = !$scope.showAvatar;
    $scope.showStats = false;
  }


//--------------------------------------------------
//
//  MAIN PANEL
//
//-------------------------------------------------

  var toolsVisible = false;
  $scope.showTools = function() {
    return toolsVisible;
  };
  $scope.toggleTools = function() {
    var feed = document.getElementById('feed');
    if(toolsVisible === true) {
      toolsVisible = false;
      feed.style.bottom = '44px';
      feed.scrollTop = feed.scrollHeight + 44;
      $scope.searchString = '';
      $scope.cannedModel = '';
    } else {
      toolsVisible = true;
      feed.style.bottom = (44 + 40 * 3) + 'px'; // 3 tools.
      feed.scrollTop = feed.scrollHeight + (44 + 40 * 3); // 3 tools.
    }
  };

  // $http.get('/api/chat').success(function(chats) {
  //   console.log('GET success!');
  //   $scope.chats = chats;
  // }).error(function(data, status, headers, config) {
  //   console.log('GET error!', '\ndata:', data, '\nstatus:', status, '\nheaders:', headers, '\nconfig:', config);
  // });

  // $scope.doneUp = function() {
  //   $http.get('/download').success(function() {
  //     console.log('GET success!');
  //   }).error(function(data, status, headers, config) {
  //     console.log('GET error!', '\ndata:', data, '\nstatus:', status, '\nheaders:', headers, '\nconfig:', config);
  //   });
  // };

  var isChatValid = function(chat) {
    if(chat.body === undefined || chat.body.length > 140) {
      return false;
    } else {
      return true;
    }
  };

  var resetChatForm = function(chat) {
    $scope.cannedModel = '';
    chat.body = undefined;
  };
  
  $scope.getUsername = function(){
    $http.get('/api/users/me').success(function(user){
      $scope.currentUser = user;
      $scope.settings.users = user.settings.users;
      console.log($scope.settings.users);
    });  
  }

  // $scope.sendChat = function(chat) {
  //   // console.log('sendChat invoked. chat.name:', chat.name, 'chat.body:', chat.body, 'this:', this);
  //   if(!isChatValid(chat)) {
  //     console.log('Invalid chat, overriding "send".');
  //     return;
  //   }
  //   $http.post('/api/chat', {
  //     user: $scope.user.name,
  //     body: chat.body,
  //     image: ''
  //   }).success(function() {
  //     console.log('POST success!');
  //     $http.get('/api/chat').success(function(chats) {
  //       console.log('GET success!');
  //       $scope.chats = chats;
  //     }).error(function(data, status, headers, config) {
  //       console.log('GET error!', '\ndata:', data, '\nstatus:', status, '\nheaders:', headers, '\nconfig:', config);
  //     });
  //     resetChatForm(chat);
  //   }).error(function(data, status, headers, config) {
  //     console.log('POST error!', '\ndata:', data, '\nstatus:', status, '\nheaders:', headers, '\nconfig:', config);
  //   });
  // };
  
  $scope.layer;
  $scope.map;
  $scope.dropMarker;
  $scope.pickMarker;

  $scope.hideMap = true;
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

    $('#map').height($(window).height());
    $scope.map.invalidateSize();
  };

  $scope.hidePic = true;
  $scope.createPic = function() {
    $('#pic').height($(window).height());
  };

  $scope.showMapOrPic = function(chat) {
    // console.log(chat);
    if(chat.image !== undefined) {
      $('#pic').css('background', 'url(' + chat.image + ') no-repeat center center');
      $scope.hidePic = false;
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
      $scope.hideMap = false;
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
