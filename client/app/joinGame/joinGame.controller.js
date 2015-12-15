'use strict';

angular.module('tictactoeApp')
  .controller('JoinGameCtrl', function($scope, $http, $location, gameState, $state, guid) {
    var thenHandleEvents = function(postPromise) {
      postPromise.then(function(data) {
        $scope.gameState.mutate(data.data);
      });
    };
    
    $scope.gameState = gameState();
    // var gameID = $location.search().gameID;
    
    thenHandleEvents($http.get('/api/gameHistory/' + $state.params.gameID));
    
    $scope.joinGame = function() {
      var user = {'userName': $scope.userName, side: 'O'};
      var joinPostPromise = $http.post('/api/joinGame/', {
        'eventID': guid(),
        'gameID': $scope.gameState.gameID,
        'command': 'JoinGame',
        'user': user,
        'timeStamp': '2015.12.14T22:04:03'
      });
      thenHandleEvents(joinPostPromise);
      joinPostPromise.then(function() {
        $location.url('/tictactoe');
        $location.search('gameSide', 'O');
        $location.search('gameID', $scope.gameState.gameID);
      });
    };
  });