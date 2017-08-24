'use strict';

/**
 * @ngdoc function
 * @name migsApp.controller:ChartCtrl
 * @description
 * # ChartCtrl
 * Controller of the migsApp
 */
angular.module('migsApp')
  .controller('ChartCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var trace1 = {
        x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        y: [85, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        type: 'scatter'
    };

    var data = [trace1];
    Plotly.newPlot('myDiv', data);


  });


