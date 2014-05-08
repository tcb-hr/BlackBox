// 'use strict';

// var app = angular.module('feedApp');

// app.directive('slidePanel', ['$swipe', function($swipe) { // MOVE DIRECTIVES TO A SEPARATE FILE?
//   return {
//     restrict: 'EA',
//     link: function(scope, ele, attrs, ctrl) {
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

// app.directive('scrollBottom', function($window) { 
  
//   var scrollBottomWrap = function() {

//     var scrollToBottom = function() {
//       var feed = $window.document.getElementById('feed');
//       feed.scrollTop = feed.scrollHeight + 44;
//     };
//     scrollToBottom();

//     $window.addEventListener('resize', function() {
//       scrollToBottom();
//     });

//   };

//   return {
//     link: scrollBottomWrap
//   };

// });