'use strict';

var tictactoeCommandHandler = require('./tictactoeCommandHandler');

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

  it('should not allow joining of a game that does not exist', () => {
    given = [];

    when = {
      eventID: "6",
      command: "JoinGame",
      userName: "Raggi",
      gameName: "NonExistingGame",
      timeStamp: "2015.12.03T15:30:56"
    };

    then = [{
      eventID: "6",
      event: "GameDoesNotExist",
      userName: "Raggi",
      timestamp: "2015.12.03T15:30:56"
    }];

    const actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });
});
