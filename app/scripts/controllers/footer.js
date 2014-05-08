'use strict'

var app = angular.module('feedApp');


app.controller('FootCtrl', function($scope, $http, $window) {
  // BREAK SOME OF THESE PIECES BELOW INTO SEPARATE CONTROLLERS?

 
  $scope.doneUp = function() {
    $http.get('/download').success(function() {
      console.log('GET success!');
    }).error(function(data, status, headers, config) {
      console.log('GET error!', '\ndata:', data, '\nstatus:', status, '\nheaders:', headers, '\nconfig:', config);
    });
  };

  // This function is called if the user makes a dropdown selection.
  // User's dropdown selection will be added to the composition field.
  $scope.composeCanned = function(chat) {
    if(chat.body === undefined) {
      chat.body = $scope.cannedModel;
    } else {
      chat.body += ' ' + $scope.cannedModel;
    }
  };

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

  $scope.sendChat = function(chat) {
    console.log('sendChat invoked. chat.name:', chat.name, 'chat.body:', chat.body, 'this:', this);
    if(!isChatValid(chat)) {
      console.log('Invalid chat, overriding "send".');
      return;
    }
    $http.post('/api/chat', {
      user: $scope.user.name,
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
      resetChatForm(chat);
    }).error(function(data, status, headers, config) {
      console.log('POST error!', '\ndata:', data, '\nstatus:', status, '\nheaders:', headers, '\nconfig:', config);
    });
  };
});

// app.filter('searchFor', function() {
//   return function(arr, searchString) {
//     if(!searchString) {
//       return arr;
//     }
//     var result = [];
//     searchString = searchString.toLowerCase();
//     angular.forEach(arr, function(chat) {
//       if(chat.body && chat.body.toLowerCase().indexOf(searchString) !== -1) {
//         result.push(chat);
//       }
//     });
//     return result;
//   };
// });
