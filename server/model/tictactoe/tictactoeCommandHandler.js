'use strict';

module.exports = function tictactoeCommandHandler(events) {
  var gameState = {
    gameCreatedEvent: events[0],
    winner: '',
    board: [['','',''],['','',''],['','','']],
    gameID: undefined
  };

  for(var i = 0; i < events.length; i++) {
    if(events[i].event === 'Placed') {
      gameState.board[events[i].col][events[i].row] = events[i].token;
    }
  }

  var handlers = {
    "CreateGame": function(command) {
      gameState.gameID = command.gameID;
      return [{
        eventID: command.eventID,
        gameID: command.gameID,
        event: "GameCreated",
        userName: command.userName,
        gameName: command.gameName,
        timeStamp: command.timeStamp
      }];
    },

    "JoinGame": function(command) {
      if(!gameState.gameCreatedEvent) {
        return [{
          eventID: command.eventID,
          event: "GameDoesNotExist",
          userName: command.userName,
          timestamp: command.timeStamp
        }];
      }

      return [{
        eventID: command.eventID,
        event: "GameJoined",
        gameID: gameState.gameID,
        userName: command.userName,
        otherPlayerUserName: gameState.gameCreatedEvent.userName,
        gameName: command.gameName,
        timeStamp: command.timeStamp
      }];
    },

    "Place": function(command) {
      if(command.col > 2 || command.col < 0 || command.row > 2 || command.col < 0) {
        return [{
          eventID: command.eventID,
          event: "IllegalMove",
          gameID: gameState.gameID,
          row: command.row,
          col: command.col,
          token: command.token,
          userName: command.userName,
          gameName: command.gameName,
          timeStamp: command.timeStamp
        }];
      }

      if(gameState.board[command.col][command.row] !== '') {
        return [{
          eventID: command.eventID,
          event: "IllegalMove",
          gameID: gameState.gameID,
          row: command.row,
          col: command.col,
          token: command.token,
          userName: command.userName,
          gameName: command.gameName,
          timeStamp: command.timeStamp
        }];
      }

      var prevEvent = events[events.length - 1];

      if(prevEvent.event === 'Placed' &&
          prevEvent.token === command.token) {
            return [{
              eventID: command.eventID,
              event: "NotYourTurn",
              gameID: gameState.gameID,
              row: command.row,
              col: command.col,
              token: command.token,
              userName: command.userName,
              gameName: command.gameName,
              timeStamp: command.timeStamp
            }];
          }

      gameState.board[command.col][command.row] = command.token;
      if (gameState.board[command.col][0] === command.token &&
          gameState.board[command.col][1] === command.token &&
          gameState.board[command.col][2] === command.token) { // Horizontal win check
        gameState.winner = command.userName;
        return [{
          eventID: command.eventID,
          event: "Placed",
          gameID: gameState.gameID,
          row: command.row,
          col: command.col,
          token: command.token,
          userName: command.userName,
          gameName: command.gameName,
          timeStamp: command.timeStamp
        },
        {
          eventID: command.eventID,
          event: "GameOver",
          gameID: gameState.gameID,
          token: command.token,
          winner: command.userName,
          gameName: command.gameName,
          timeStamp: command.timeStamp
        }];
      } else if (gameState.board[0][command.row] === command.token &&
                  gameState.board[1][command.row] === command.token &&
                  gameState.board[2][command.row] === command.token) { // Vertical win check
        gameState.winner = command.userName;
        return [{
          eventID: command.eventID,
          event: "Placed",
          gameID: gameState.gameID,
          row: command.row,
          col: command.col,
          token: command.token,
          userName: command.userName,
          gameName: command.gameName,
          timeStamp: command.timeStamp
        },
        {
          eventID: command.eventID,
          event: "GameOver",
          gameID: gameState.gameID,
          token: command.token,
          winner: command.userName,
          gameName: command.gameName,
          timeStamp: command.timeStamp
        }];
      } else if (gameState.board[0][0] === command.token &&
                  gameState.board[1][1] === command.token &&
                  gameState.board[2][2] === command.token) { // Diagonal test left to right
        gameState.winner = command.userName;
        return [{
          eventID: command.eventID,
          event: "Placed",
          gameID: gameState.gameID,
          row: command.row,
          col: command.col,
          token: command.token,
          userName: command.userName,
          gameName: command.gameName,
          timeStamp: command.timeStamp
        },
        {
          eventID: command.eventID,
          event: "GameOver",
          gameID: gameState.gameID,
          token: command.token,
          winner: command.userName,
          gameName: command.gameName,
          timeStamp: command.timeStamp
        }];
      } else if (gameState.board[0][2] === command.token &&
                  gameState.board[1][1] === command.token &&
                  gameState.board[2][0] === command.token) { // Diagonal test right to left
        return [{
          eventID: command.eventID,
          event: "Placed",
          gameID: gameState.gameID,
          row: command.row,
          col: command.col,
          token: command.token,
          userName: command.userName,
          gameName: command.gameName,
          timeStamp: command.timeStamp
        },
        {
          eventID: command.eventID,
          event: "GameOver",
          gameID: gameState.gameID,
          token: command.token,
          winner: command.userName,
          gameName: command.gameName,
          timeStamp: command.timeStamp
        }];
      }

      if(boardFull(gameState.board)) {
        return [{
          eventID: command.eventID,
          event: "Placed",
          gameID: gameState.gameID,
          row: command.row,
          col: command.col,
          token: command.token,
          userName: command.userName,
          gameName: command.gameName,
          timeStamp: command.timeStamp
        },
        {
          eventID: command.eventID,
          event: "GameDrawn",
          gameID: gameState.gameID,
          token: command.token,
          lastUser: command.userName,
          gameName: command.gameName,
          timeStamp: command.timeStamp
        }];
      }

      return [{
        eventID: command.eventID,
        event: "Placed",
        gameID: gameState.gameID,
        row: command.row,
        col: command.col,
        token: command.token,
        userName: command.userName,
        gameName: command.gameName,
        timeStamp: command.timeStamp
      }];
    }
  };

  return {
    executeCommand: function(command) {
      return handlers[command.command](command);
    }
  }
};

function boardFull(board) {
  for(var i = 0; i < board.length; i++) {
    for(var ii = 0; ii < board[i].length; ii++) {
      if(board[i][ii] === '') {
        return false;
      }
    }
  }
  return true;
}
