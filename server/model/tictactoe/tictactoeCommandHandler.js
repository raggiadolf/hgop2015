'use strict';

module.exports = function tictactoeCommandHandler(events) {
  const gameCreatedEvent = events[0];

  const handlers = {
    "CreateGame": (command) => {
        return [{
          eventID: command.eventID,
          event: "GameCreated",
          userName: command.userName,
          timeStamp: command.timeStamp
        }];
    },

    "JoinGame": (command) => {
        return [{
          eventID: command.eventID,
          event: "GameJoined",
          userName: command.userName,
          otherPlayerUserName: gameCreatedEvent.userName,
          timeStamp: command.timeStamp
        }];
    },
  };

  return {
    executeCommand: (command) => {
      return handlers[command.command](command);
    }
  }
};
