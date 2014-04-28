'use strict';

angular.module('feedApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
