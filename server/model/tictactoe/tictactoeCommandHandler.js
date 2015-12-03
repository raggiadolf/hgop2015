'use strict';

module.exports = function tictactoeCommandHandler(events) {
  const gameState = {
    gameCreatedEvent: events[0],
    board: [['','',''],['','',''],['','','']]
  };

  const handlers = {
    "CreateGame": (command) => {
      return [{
        eventID: command.eventID,
        event: "GameCreated",
        userName: command.userName,
        gameName: command.gameName,
        timeStamp: command.timeStamp
      }];
    },

    "JoinGame": (command) => {
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
        userName: command.userName,
        otherPlayerUserName: gameState.gameCreatedEvent.userName,
        gameName: command.gameName,
        timeStamp: command.timeStamp
      }];
    },

    "Place": (command) => {
      gameState.board[command.col][command.row] = command.token;
      return [{
        eventID: command.eventID,
        event: "Placed",
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
    executeCommand: (command) => {
      return handlers[command.command](command);
    }
  }
};
