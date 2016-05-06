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