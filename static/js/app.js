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