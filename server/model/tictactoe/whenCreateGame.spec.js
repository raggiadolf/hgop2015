'use strict';

var tictactoeCommandHandler = require('./tictactoeCommandHandler');

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
      timeStamp: "2015.12.03T12:54:44"
    }];

    const actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  it('should create a second game with different user and different timestamp', () => {
    given = [];

    when = {
      eventID: "4",
      command: "CreateGame",
      userName: "Adolf",
      gameName: "SecondTestGame",
      timeStamp: "2015.12.03T13:41:10"
    };

    then = [{
      eventID: "4",
      event: "GameCreated",
      userName: "Adolf",
      timeStamp: "2015.12.03T13:41:10"
    }];

    const actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });
});
