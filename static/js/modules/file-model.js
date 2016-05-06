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