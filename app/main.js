/* 
 * File : main.js
 * Date : 12 Sep 16
 * Name : Jaymes Young
 */

'use strict';

angular.module('wordGenerator')
    .controller('mainCtrl', function($scope, $sce, wordList) {
      $scope.wordsType = '';
      $scope.untrustedWords;
      $scope.trustedWords;
      $scope.msgQty = "Max words is 400";
      $scope.wordLimit = "Max words is 400";
      $scope.sentenceLimit = "Max sentences is 100";
      $scope.paragraphLimit = "Max paragraphs is 15";
      
      
      // Get text to use
      $scope.getWords = function(type) {
        
        if (type === 'meat') {
          wordList.getMeatWords(function(response) {
            $scope.untrustedWords = response.data;
          });
        } else if (type === 'doctor') {
          wordList.getDoctorWords(function(response) {
            $scope.untrustedWords = response.data;
          });
        } else if (type === 'german') {
          wordList.getGermanWords(function(response) {
            $scope.untrustedWords = response.data;
          });
        }   
      };
      
      
      // Fisher–Yates Shuffle
      $scope.shuffle = function (array) {
        var m = array.length, t, i;

        // While there remain elements to shuffle…
        while (m) {

          // Pick a remaining element…
          i = Math.floor(Math.random() * m--);

          // And swap it with the current element.
          t = array[m];
          array[m] = array[i];
          array[i] = t;
        }

        return array;
      };
      
      
      // Make words array
      $scope.getWordsArray = function() {
        var output = $scope.untrustedWords.split(' ');
        // remove periods ?
        // make words lower case ?
        
        return output;
      };


      // Make sentences array
      $scope.getSentencesArray = function() {
        var words = $scope.untrustedWords;
        var posEndSlice;
        var sentences = [];
        
        // Loop while there are words
        while (words.length !== 0) {
          var indexes = [];
          indexes.push(words.indexOf('.'));
          indexes.push(words.indexOf('!'));
          indexes.push(words.indexOf('?'));
          indexes.sort(function(a, b) {return a-b;});
          
          // Loop through indexes and get the lowest number
          for (var j = 0; j < indexes.length; j++) {
            if (indexes[j] !== -1) {
              posEndSlice = indexes[j];
              break;
            } else {
              posEndSlice = indexes[j];
            }
          }
          
          // Break while loop if there is no (.!?)
          if(posEndSlice === -1) {
            break;
          }
          
          // Add sentence to sentences array
          sentences.push(words.slice(0, posEndSlice + 1));
          
          // Create new words string minus the sentence that was just removed.
          words = words.substr(posEndSlice + 1).trim();
          
        }
        return sentences;
      };
      
      
      // Increase the number of words until grater than quantity
      $scope.increaseWords = function(arrWords, qty) {
        // Double amount of words
        arrWords = arrWords.concat(arrWords);
        
        while(arrWords.length < qty) {
          // Increase words again if needed
          arrWords = $scope.increaseWords(arrWords, qty);
        }
        
        return arrWords;
      };
      
      
      // Make list of words
      $scope.makeWords = function(qty) {
        var output ='';
        var outputMsg = '';
        var words = $scope.getWordsArray();
        
        // Max number of words is 400
        if (qty > 400) {
          qty = 400;
          outputMsg += '<p class="error">Your tried to go over the limit, shame on you</p>';
        }
        
        // Check is qty is larger than number of words, double if needed.
        if(words.length < qty) {
          words = $scope.increaseWords(words, qty);
        }
        
        // Shuffle words
        var shuffledWords = $scope.shuffle(words);
        
        for (var i = 0; i < qty; i++) {
          output += shuffledWords[i] + ' ';
        }
        
        return '<p>' + output.trim() + '</p>' + outputMsg;
      };
      
      
      // Make sentences
      $scope.makeSentences = function(qty) {
        var output = '';
        var outputMsg = '';
        var sentences = $scope.getSentencesArray();
        
        // Max number of sentences is 100
        if (qty > 100) {
          qty = 100;
          outputMsg += '<p class="error">Your tried to go over the limit, shame on you</p>';
        }
        
        // Check is qty is larger than number of words, double if needed.
        if(sentences.length < qty) {
          sentences = $scope.increaseWords(sentences, qty);
        }
        
        // Shuffle sentences
        var shuffledSentences = $scope.shuffle(sentences);
        
        // Loop and add sentence to the array
        for (var i = 0; i < qty; i++) {
          output += shuffledSentences[i] + ' ';
        }
        
        return output + outputMsg;
      };
      
      
      // Make paragraphs
      $scope.makeParagraphs = function(qty) {
        var output = '';
        var outputMsg = '';
        
        // Max number of paragraphs is 15
        if (qty > 15) {
          qty = 15;
          outputMsg += '<p class="error">Your tried to go over the limit, shame on you</p>';
        }
        
        for (var i = 0; i < qty; i++) {
          output += '<p>' + $scope.makeSentences(7) + '</p>';
        }
        
        return output + outputMsg;
      };
      
      // Make words trusted
      $scope.makeTrusted = function(words) {
        var output = $sce.trustAsHtml(words);
        return output;
      };
      
  
      // Get words
      $scope.$on('outputWords', function(evt, args) {
        
        if(args.type === 'words') {
          var words = $scope.makeWords(args.qty);
          $scope.trustedWords = $scope.makeTrusted(words);
        } else if (args.type === 'sentences') {
          var words = '<p>' + $scope.makeSentences(args.qty) + '</p>';
          $scope.trustedWords = $scope.makeTrusted(words);
        } else if (args.type === 'paragraphs') {
          var words = $scope.makeParagraphs(args.qty);
          $scope.trustedWords = $scope.makeTrusted(words);
        } else {
          console.log('Missing type value');
        }
        
      });

});
