'use strict';

angular.module('tictactoeApp')
  .controller('TictactoeController', function($scope, $http, gameState, guid, $location, $interval) {
    
    $scope.gameState = gameState();
    
    var thenHandleEvents = function(postPromise) {
      postPromise.then(function(data) {
        $scope.gameState.mutate(data.data);
      });
      
      postPromise.then(function() {
        if(mySide() === 'X') {
          $scope.me = $scope.gameState.creatingUser;
          $scope.other = $scope.gameState.joiningUser;
        } else {
          $scope.other = $scope.gameState.creatingUser;
          $scope.me = $scope.gameState.joiningUser;
        }
        
        $scope.joinUrl = 'http://' + $location.host() + ($location.port() ? ':' + $location.port() : '') + '/join/' + $scope.gameState.gameID;
      });
    };
    
    var gameID = $location.search().gameID;
    
    function refresh() {
      thenHandleEvents($http.get('/api/gameHistory/' + gameID));
    }
    
    refresh();
    $interval(refresh, 2000);
    
    function mySide() {
      return $location.search().gameSide;
    }
    
    $scope.myTurn = function() {
      return mySide() === $scope.gameState.nextTurn;
    };
    
    $scope.placeMove = function(coords) {
      if(!$scope.myTurn()) {
        return;
      }
      var eventID = guid();
      thenHandleEvents($http.post('/api/placeMove/', {
        eventID: eventID,
        gameID: $scope.gameState.gameID,
        command: 'Place',
        userName: $scope.me.userName,
        timeStamp: '2015.12.15T10:07:29',
        row: coords[0],
        col: coords[1]
      }));
    };
  });