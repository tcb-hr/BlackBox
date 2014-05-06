'use strict';

var app = angular.module('feedApp', [
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'angularMoment',
  'flow'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider, flowFactoryProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        // authenticate: true,
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
      
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
    // ngFlow pic uploader
    flowFactoryProvider.defaults = {
      target: './upload',
      permanentErrors: [404, 501], //500
      maxChunkRetries: 3,
      chunkSize: 15000,
      chunkRetryInterval: 5000,
      simultaneousUploads: 1,
      singleFile: true
    };
    flowFactoryProvider.on('catchAll', function (event) {
      console.log('catchAll', arguments);
    });
    // flowFactoryProvider.on('complete', function ($http){
    //   $http({method: 'GET', url: './download'}).
    //     success(function(data, status, headers, config) {
    //       console.log("WE WRITIN", data, status, headers, config);
    //     }).
    //     error(function(data, status, headers, config) {
    //       // called asynchronously if an error occurs
    //       // or server returns response with an error status.
    //   });      
    // })

  })
  .run(function ($rootScope, $location, $http, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {

      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });
