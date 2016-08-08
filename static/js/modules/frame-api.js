/**
 * @fileOverview Frame API service.
 * @module frame-api
 */

(function(window, angular) {
  "use strict";

  var module = angular.module('frame-api', ['settings']);

  module.factory('frameApi', [
    '$http', 'urls', function ($http, urls) {
      var apiUrl = 'http://' + urls.frameApi;

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
