(function (angular) {
    "use strict";

    angular.module('settings', [])
      .constant('urls', {
        frameApi: '%FRAMES_API%'
      });
}) ((window.angular));