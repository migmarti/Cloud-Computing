'use strict';

/**
 * @ngdoc function
 * @name migsApp.controller:A4Ctrl
 * @description
 * # A4Ctrl
 * Controller of the migsApp
 */
angular.module('migsApp')
  .controller('A4Ctrl', function ($scope, $http, md5) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var limit = 100;
    var offset = 0;
    var characterNames = [];
    var characterComics = new Map();
    var characterSeries = new Map();
    var timeStamp = new Date();
    var privateKey = '6c454472cc985829b464b06c7dc908fc9f5ed8ec';
    var publicKey = '22f8edbc735e0e4d217bd6ad0d808bc7';
    var hash = md5.createHash(timeStamp + privateKey + publicKey);
    var exit = false;
    while (offset <= limit * 14) {
         var url = "https://gateway.marvel.com:443/v1/public/characters?ts=" + timeStamp + "&apikey=" + publicKey + "&hash=" + hash + "&limit=" + limit + "&offset=" + offset;
         $http.get(url)
             .then(function (response) {
                 var info = response.data;
                 var results = info.data.results;
                 for (var i = 0; i < results.length; i++) {
                     var character = {
                         name: results[i].name,
                         comics: results[i].comics,
                         series: results[i].series
                     };
                     characterNames.push(character.name);
                     characterComics.set(character.name, character.comics);
                     characterSeries.set(character.name, character.series);
                 }
             })
             .catch(function (data) {
                 console.log('An error has occurred. ' + data);
                 exit = true
             });
         if (exit) { break; }
         offset += 100;
    }
    $scope.names = characterNames;
    //$scope.names = ['mike', 'shorpo', 'puskintio'];
    $scope.execute = function () {
        $scope.comics = [];
        $scope.series = [];
        if ($scope.selectedName != null && $scope.selectedName2 != null) {
            var n1 = $scope.selectedName;
            var n2 = $scope.selectedName2;
            $scope.comics = getCommon(characterComics.get(n1), characterComics.get(n2));
            $scope.series = getCommon(characterSeries.get(n1), characterSeries.get(n2));
            document.getElementById('theDiv').style.visibility = 'visible';
        }
    };

    var getCommon = function (object1, object2) {
        var names = [], result = [];
        for (var i = 0; i < object1.items.length; i++) {
            names.push(object1.items[i].name);
        }
        for (var i = 0; i < object2.items.length; i++) {
            if (names.includes(object2.items[i].name)) {
                result.push(object2.items[i].name);
            }
        }

        return result;
    };

  });
