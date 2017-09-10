'use strict';

/**
 * @ngdoc overview
 * @name migsApp
 * @description
 * # migsApp
 *
 * Main module of the application.
 */
angular
  .module('migsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/assignments', {
        templateUrl: 'views/assignments.html',
        controller: 'AssignCtrl',
        controllerAs: 'assign'
      })
      .when('/a2', {
        templateUrl: 'views/a2.html'
      })
      .when('/a3', {
        templateUrl: 'views/a3.html'
      })
      .when('/chart', {
        templateUrl: 'views/chart.html',
        controller: 'ChartCtrl',
        controllerAs: 'chart'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
