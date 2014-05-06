'use strict';

var app = angular.module('feedApp')
  
app.controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;
      
      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors.other = err.message;
        });
      }
    };
  });

// app.factory('Auth', function($http, $rootScope, $cookieStore){

//     var accessLevels = routingConfig.accessLevels
//         , userRoles = routingConfig.userRoles
//         , currentUser = $cookieStore.get('user') || 
//                         { username: '', role: userRoles.public };

//     // ...

//     return {

//         // ...

//         accessLevels: accessLevels,
//         userRoles: userRoles,
//         user: currentUser
//     };

// });