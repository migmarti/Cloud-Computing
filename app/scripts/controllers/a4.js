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
    $scope.names = [];
    var limit = 100;
    var offset = 0;
    var characters = new Map();
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
                     $scope.names.push(results[i].name);
                     characters.set(results[i].name, results[i].id);
                 }
             })
             .catch(function (data) {
                 console.log('An error has occurred. ' + data);
                 exit = true
             });
         if (exit) { break; }
         offset += 100;
    }
    //$scope.names = ['mike', 'shorpo', 'puskintio'];
    $scope.execute = function () {
        $scope.comicString ='Loading Common Comics...';
        $scope.seriesString ='Loading Common Series...';
        $scope.comics = [];
        $scope.series = [];
        if ($scope.selectedName != null && $scope.selectedName2 != null) {
            var id1 = characters.get($scope.selectedName);
            var id2 = characters.get($scope.selectedName2);

            document.getElementById('theDiv').style.visibility = 'visible';

            //API KEY: dJYKAs1XFW8oAJj1dqj9X7VWztbQ8tyy3SNUkegI

            var reqComics = {
                method: 'POST',
                url: 'https://mksjpypoh9.execute-api.us-east-1.amazonaws.com/TestStage/comics',
                headers: {
                    'X-API-KEY':'dJYKAs1XFW8oAJj1dqj9X7VWztbQ8tyy3SNUkegI'
                },
                data: { "id1": id1, "id2": id2 }
            }

            $http(reqComics)
                .then(function (response) {
                    var info = response.data;
                    $scope.comics = getCommon(info[0], info[1]);
                    if ($scope.comics.length == 0) {
                        alert('No common comics found.');
                    }
                    $scope.comicString = 'Common Comics';
                })
                .catch(function (data) {
                    alert('An error has occurred. ' + data);
                });

            var reqSeries = {
                method: 'POST',
                url: 'https://mksjpypoh9.execute-api.us-east-1.amazonaws.com/TestStage/series',
                headers: {
                    'X-API-KEY':'dJYKAs1XFW8oAJj1dqj9X7VWztbQ8tyy3SNUkegI'
                },
                data: { "id1": id1, "id2": id2 }
            }

            $http(reqSeries)
                .then(function (response) {
                    var info = response.data;
                    $scope.series = getCommon(info[0], info[1]);
                    if ($scope.series.length == 0) {
                        alert('No common series found.');
                    }
                    $scope.seriesString = 'Common Series';
                })
                .catch(function (data) {
                    alert('An error has occurred. ' + data);
                });

            //comics: https://mksjpypoh9.execute-api.us-east-1.amazonaws.com/TestStage
            //series: https://5f8auylbwd.execute-api.us-east-1.amazonaws.com/TestStage


        }
    };

      var getCommon = function (object1, object2) {
          var set = new Set();
          for (var i = 0; i < object2.length; i++) {
              if (object1.includes(object2[i])) {
                  set.add(object2[i]);
              }
          }
          return Array.from(set);
      };

  });
