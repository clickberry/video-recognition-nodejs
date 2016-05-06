/**
 * @fileOverview Home view.
 * @module home
 */

(function(window, angular) {
    "use strict";

    var module = angular.module('home', [
      'ui.router',
      'video-api',
      'file-model',
      'frame-api'
    ]);

    // Routes
    module.config([
      '$stateProvider', function ($stateProvider) {
        $stateProvider
          .state('home', {
            url: '/',
            templateUrl: 'home.html',
            controller: 'HomeCtrl',
            data: {
              pageTitle: 'Clickberry Video Recognition Service'
            }
          });
        }
    ]);

    // Controllers
    module.controller('HomeCtrl', [
      '$scope', '$state', 'videoApi', '$mdDialog', 'frameApi', '$timeout',
      function ($scope, $state, videoApi, $mdDialog, frameApi, $timeout) {
        $scope.file = null;
        $scope.loading = false;
        $scope.video = null;

        $scope.frames = [];
        $scope.framesLoading = false;

        $scope.upload = function (file) {
          $scope.loading = true;
          videoApi.upload(file)
            .then(function (res) {
              $scope.video = res.data;
              loadFrames(res.data.id);
            }, function (res) {
              console.error("Failed to load facilities: " + res.status);
              $mdDialog.show($mdDialog.alert()
                .clickOutsideToClose(true)
                .title("Uploading error")
                .content("Failed to upload video. Please try again.")
                .ok("Ok"));
            })
            .finally(function() {
              $scope.loading = false;
            });
        };

        var timeout, interval = 5000;
        function loadFrames(id) {
          $scope.framesLoading = true;
          frameApi.get(id)
            .then(function (res) {
              $scope.frames = res.data;
            }, function (res) {
              console.error("Failed to load frames: " + res.status);
            })
            .finally(function () {
              $scope.framesLoading = false;
            });

          timeout = $timeout(loadFrames, interval, true, id);
        }
      }
    ]);
    
})(window, window.angular);