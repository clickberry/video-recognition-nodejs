/**
 * @fileOverview Home view.
 * @module home
 */

(function(window, angular) {
    "use strict";

    var module = angular.module('home', [
      'ui.router',
      'video-api',
      'file-model'
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

        $scope.upload = function (file) {
          $scope.loading = true;
          videoApi.upload(file)
            .then(function (res) {
              $scope.video = res.data;
              $state.go('frames', {id: res.data.id});
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
      }
    ]);
    
})(window, window.angular);