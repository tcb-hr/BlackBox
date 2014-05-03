'use strict';

var app = angular.module('feedApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'angularMoment',
  'flow',
  'ngTouch',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider, flowFactoryProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
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
    flowFactoryProvider.on('complete', function(){
      console.log("WE WRITIN")
      
    })

  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });


