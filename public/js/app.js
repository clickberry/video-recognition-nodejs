/**
 * @fileOverview Binds input[type=file] selected File to $scope variable.
 * @module file-model
 */

(function(window, angular) {
  "use strict";

  var module = angular.module('file-model', []);

  module.directive('fileModel', ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;
          
          element.bind('change', function(){
            scope.$apply(function(){
              modelSetter(scope, element[0].files[0]);
            });
          });
        }
    };
}]);

})(window, window.angular);
/**
 * @fileOverview Frame API service.
 * @module frame-api
 */

(function(window, angular) {
  "use strict";

  var module = angular.module('frame-api', []);

  module.factory('frameApi', [
    '$http', function ($http) {
      var apiUrl = 'http://qa-video-frames.clickberry.tv';

      return {
        
        /**
         * Retrieves frames for video.
         *
         * @method     get
         * @param      {string}  id    Video id.
         * @return     {Promise}
         */
        get: function (id) {
          return $http.get(apiUrl + '/' + id);
        }
      };
    }
  ]);  
    
})(window, window.angular);

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
/**
 * @fileOverview Video API service.
 * @module video-api
 */

(function(window, angular) {
  "use strict";

  var module = angular.module('video-api', []);

  module.factory('videoApi', [
    '$http', function ($http) {
      var apiUrl = '/api/video';

      return {
        
        /**
         * Uploads video file.
         *
         * @method     upload
         * @param      {File}  file    File to upload.
         * @return     {Promise}
         */
        upload: function (file) {
          var fd = new FormData();
          fd.append('file', file);

          return $http.post(apiUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined} // auto-detect content type
          });
        }
      };
    }
  ]);  
    
})(window, window.angular);
/**
 * @fileOverview Application module.
 * @module app
 */

(function (angular) {
  'use strict';

  var app = angular.module('app', [
    'ui.router', // for ui routing
    'ngMaterial', // activate material design
    'home'
  ]);

  // Config
  app.config([
    '$urlRouterProvider', '$locationProvider', '$stateProvider', '$mdThemingProvider', '$animateProvider',
    function ($urlRouterProvider, $locationProvider, $stateProvider, $mdThemingProvider, $animateProvider) {
      
      // routes
      $stateProvider
        .state('auction', {
          'abstract': true,
          template: '<div ui-view></div>'
        });

      $urlRouterProvider.otherwise('/');

      // defining themes
      var primaryTheme = $mdThemingProvider.extendPalette('blue-grey', {
        'contrastLightColors': ['500']
      });
      $mdThemingProvider.definePalette('blue-grey-custom', primaryTheme);

      var secondaryTheme = $mdThemingProvider.extendPalette('green', {
        'contrastLightColors': ['500']
      });
      $mdThemingProvider.definePalette('green-custom', secondaryTheme);

      // configuring themes
      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey', {
          'default': '500',
          'hue-1': '700',
          'hue-2': '100'
        })
        .accentPalette('green-custom', {
          'default': '500'
        });

      // configure animation
      $animateProvider.classNameFilter(/^(?:(?!ng-animate-disabled).)*$/);
    }
  ]);

  // Main application controller
  app.controller('AppCtrl', [
    '$rootScope',
    function ($rootScope) {

      $rootScope.pageTitle = 'Clickberry Video Recognition Service';
      $rootScope.$on('$stateChangeSuccess', function (event, toState/*, toParams, from, fromParams*/) {
        if (angular.isDefined(toState.data) && angular.isDefined(toState.data.pageTitle)) {
          $rootScope.pageTitle = toState.data.pageTitle;
        }
      });
    }
  ]);

})((window.angular));