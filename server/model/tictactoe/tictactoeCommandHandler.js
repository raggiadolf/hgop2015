'use strict';

module.exports = function tictactoeCommandHandler(events) {
  const gameCreatedEvent = events[0];

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
      if(!gameCreatedEvent) {
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
        otherPlayerUserName: gameCreatedEvent.userName,
        timeStamp: command.timeStamp
      }];
    },

    "Place": (command) => {
      return [{
        eventID: command.eventID,
        event: "Placed",
        row: command.row,
        col: command.col,
        token: command.token,
        userName: command.userName,
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
