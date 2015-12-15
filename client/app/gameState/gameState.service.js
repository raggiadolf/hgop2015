'use strict';

angular.module('tictactoeApp')
  .factory('gameState', function() {
    return function() {
      
      var gameState = {
        created: false,
        board: [['', '', ''], ['', '', ''], ['', '' ,'']],
        nextTurn: 'X',
        gameDraw: false,
        winner: undefined,
        mutate: function(events) {
          var handlers = {
            'GameCreated': function(event, gameState) {
              gameState.created = true;
              gameState.gameName = event.gameName;
              gameState.gameID = event.gameID;
              gameState.creatingUser = event.userName;
            },
            'GameJoined': function(event, gameState) {
              gameState.joiningUser = event.userName;
            },
            'Placed': function(event, gameState) {
              gameState.board[event.row][event.col] = event.side;
              gameState.nextTurn = event.side === 'X' ? 'O' : 'X';
            },
            'GameOver': function(event, gameState) {
              gameState.nextTurn = 'GameOver';
              gameState.winner = event.winner;
            },
            'GameDrawn': function(event, gameState) {
              gameState.nextTurn = 'GameOver';
              gameState.gameDraw = true;
            }
          };
          console.debug('Mutating with events', events);
          _.each(events, function(ev) {
            if(!ev) {
              return;
            }
            if(handlers[ev.event]) {
              handlers[ev.event](ev, gameState);
            }
          });
        }
      };
      return gameState;
    };
  });