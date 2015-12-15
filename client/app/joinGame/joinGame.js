'use strict';

angular.module('tictactoeApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('join', {
        url: '/join/{gameID}',
        templateUrl: 'app/joinGame/joinGame.html',
        controller: 'JoinGameCtrl'
      });
  });