'use strict';

var app = angular.module('feedApp');

// app.directive('mySlideController', ['$swipe', function($swipe) {
//   return {
//     restrict: 'EA',
//     link: function(scope, ele, attrs, ctrl) {
//       debugger;
//       var startX, pointX;
//       $swipe.bind(ele, {
//         'start': function(coords) {
//           startX = coords.x;
//           pointX = coords.y;
//         }, 'move': function(coords) {
//           var delta = coords.x - pointX;
//         }, 'end': function(coords) {
//         }, 'cancel': function(coords) {
//         }
//       });
//     }
//   };
// }]);

app.controller('NavbarCtrl', function ($scope, $location, Auth) {
  $scope.menu = [{
    'title': 'Dashboard',
    'link': '/dashboard'
  }, {
    'title': 'Twinjet',
    'link': '/'
  }, {
    'title': 'Settings',
    'link': '/settings'
  }];
  
  $scope.logout = function() {
    Auth.logout()
    .then(function() {
      $location.path('/login');
    });
  };

  $scope.isActive = function(route) {
    return route === $location.path();
  };

  // $scope.showmenu = false;
  // $scope.toggleMenu = function() {
  //   $scope.showmenu = ($scope.showmenu) ? false : true;
  // };

});
