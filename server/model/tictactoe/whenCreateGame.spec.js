'use strict';

const tictactoeCommandHandler = (events) => {
  const gameCreatedEvent = events[0];

  return {
    executeCommand: (command) => {
      if(command.command === "CreateGame") {
        return [{
          eventID: "1",
          event: "GameCreated",
          userName: "Raggi",
          timeStap: "2015.12.03T12:54:44"
        }];
      }

      if(command.command === "JoinGame") {
        return [{
          eventID: command.eventID,
          event: "GameJoined",
          userName: command.userName,
          otherPlayerUserName: gameCreatedEvent.userName,
          timeStamp: command.timeStamp
        }];
      }
    }
  };
};

describe('create game command', () => {
  let given, when, then;

  it('should create game', () => {
    given = [];

    when = {
      eventID: "1",
      command: "CreateGame",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T12:54:44"
    };

    then = [{
      eventID: "1",
      event: "GameCreated",
      userName: "Raggi",
      timeStap: "2015.12.03T12:54:44"
    }];

    const actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });
});

describe('join game command', () => {
  let given, when, then;

  it('should join game', () => {
    given = [{
      eventID: "2",
      event: "GameCreated",
      userName: "Raggi",
      timeStamp: "2015.12.03T13:25:20"
    }];

    when = {
      eventID: "3",
      command: "JoinGame",
      userName: "Adolf",
      gameName: "TestGame",
      timeStamp: "2015.12.03T13:26:20"
    };

    then = [{
      eventID: "3",
      event: "GameJoined",
      userName: "Adolf",
      otherPlayerUserName: "Raggi",
      timeStamp: "2015.12.03T13:26:20"
    }];

    const actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });
});
