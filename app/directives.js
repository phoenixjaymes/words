/* 
 File     : directives.js
 Date     : Sep 24, 2016
 Author   : Jaymes Young <jaymes@phoenixjaymes.com>
 */

'use strict';

angular.module('wordGenerator')
    .directive('home', function() {
      return {
        templateUrl : 'app/views/home.html'
      };
    })
    .directive('meat', function() {
      return {
        templateUrl : 'app/views/meat.html'
      };
    })
    .directive('doctor', function() {
      return {
        templateUrl : 'app/views/doctor.html'
      };
    })
    .directive('german', function() {
      return {
        templateUrl : 'app/views/german.html'
      };
    });