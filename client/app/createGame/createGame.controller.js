'use strict';

angular.module('tictactoeApp')
  .controller('CreateGameCtrl', function($scope, $http, guid, $location) {
    $scope.createGame = function() {
      var user = {'userName': $scope.userName, side: 'X'};

      var eventID = guid();
      var gameID = guid();
      var createPost = $http.post('/api/createGame/', {
        'eventID': eventID,
        'gameID': gameID,
        'command': 'CreateGame',
        'userName': user.userName,
        gameName: $scope.name,
        'timeStamp': '2014-12-02T11:29:29'
      });
      createPost.then(function(response) {
        $location.url('/tictactoe');
        $location.search('gameID', response.data[0].gameID);
        $location.search('gameSide', 'X');
      });
    };
  });
