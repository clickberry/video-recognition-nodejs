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
