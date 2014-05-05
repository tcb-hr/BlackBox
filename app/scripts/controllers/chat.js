'use strict';

app.controller('ChatCtrl', function($scope, $http, $window) {
  $scope.$on('flow::complete', function (event, $flow, flowFile) {
    console.log('we writing, yo');
    $http.get('/download');
  });
});