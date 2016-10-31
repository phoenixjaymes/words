/*
Filename  : words.service.js
Date      : 12 Aug 16
Programmer: Jaymes Young-Liebgott
*/

angular.module('wordGenerator')
    .service('wordList', function($http) {
      // Meat wordlist
      this.getMeatWords = function(callback) {
        $http.get('mock/meat.html').then(callback);
      };
        
      // Doctor Who word list
      this.getDoctorWords = function(callback) {
        $http.get('mock/doctor.html').then(callback);
      };
      
      // German word list
      this.getGermanWords = function(callback) {
        $http.get('mock/german.html').then(callback);
      };
});
