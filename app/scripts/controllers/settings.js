'use strict';

angular.module('feedApp')
  .controller('SettingsCtrl', function ($scope, User, Auth) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
        });
      }
		};
    $scope.changeUsername = function(form) {
      $scope.submitted = true;
        Auth.changeUsername( $scope.user.oldUsername, $scope.user.newUsername )
        .then( function() {
          $scope.message = 'Username successfully changed.';
        })
        .catch( function() {
          form.Username.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect Username';
        });
    };
  });
