'use strict';

angular.module('devApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
