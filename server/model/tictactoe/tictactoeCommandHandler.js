'use strict';

module.exports = function tictactoeCommandHandler(events) {
  const gameState = {
    gameCreatedEvent: events[0],
    winner: '',
    board: [['','',''],['','',''],['','','']]
  };

  for(let i = 0; i < events.length; i++) {
    if(events[i].event === 'Placed') {
      gameState.board[events[i].col][events[i].row] = events[i].token;
    }
  }

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
      if(command.col > 2 || command.row > 2) {
        return [{
          eventID: command.eventID,
          event: "IllegalMove",
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
          row: command.row,
          col: command.col,
          token: command.token,
          userName: command.userName,
          gameName: command.gameName,
          timeStamp: command.timeStamp
        }];
      }

      const prevEvent = events[events.length - 1];

      if(prevEvent.event === 'Placed'
          && prevEvent.token === command.token) {
            console.log(prevEvent.event);
            console.log(prevEvent.token);
            return [{
              eventID: command.eventID,
              event: "NotYourTurn",
              row: command.row,
              col: command.col,
              token: command.token,
              userName: command.userName,
              gameName: command.gameName,
              timeStamp: command.timeStamp
            }];
          }

      gameState.board[command.col][command.row] = command.token;
      if(gameState.board[command.col][0] === command.token
          && gameState.board[command.col][1] === command.token
          && gameState.board[command.col][2] === command.token) {
            return [{
              eventID: command.eventID,
              event: "Placed",
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
              token: command.token,
              winner: command.userName,
              gameName: command.gameName,
              timeStamp: command.timeStamp
            }];
          }
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
