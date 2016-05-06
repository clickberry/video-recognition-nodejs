/**
 * @fileOverview Frames view.
 * @module frames
 */

(function(window, angular) {
    "use strict";

    var module = angular.module('frames', [
      'ui.router',
      'frame-api'
    ]);

    // Routes
    module.config([
      '$stateProvider', function ($stateProvider) {
        $stateProvider
          .state('frames', {
            url: '/video/{id}',
            templateUrl: 'frames.html',
            controller: 'FramesCtrl',
            data: {
              pageTitle: 'Video Recognition Results'
            }
          });
        }
    ]);

    // Controllers
    module.controller('FramesCtrl', [
      '$scope', '$stateParams', 'frameApi', '$timeout',
      function ($scope, $stateParams, frameApi, $timeout) {
        $scope.frames = {};
        $scope.loading = false;

        var timeout, interval = 5000;
        function loadFrames(id) {
          $scope.framesLoading = true;
          frameApi.get(id)
            .then(function (res) {
              if ($scope.frames.length !== res.data.length){
                $scope.frames = res.data;
              }
            }, function (res) {
              console.error("Failed to load frames: " + res.status);
            })
            .finally(function () {
              $scope.framesLoading = false;
            });

          timeout = $timeout(loadFrames, interval, true, id);
        }

        loadFrames($stateParams.id);
      }
    ]);
    
})(window, window.angular);