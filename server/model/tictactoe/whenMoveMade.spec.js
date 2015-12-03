'use strict';

var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('place token command', () => {
  let given, when, then;

  beforeEach(() => {
    given = [{
        eventID: "1",
        event: "GameCreated",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T12:54:44"
      },
      {
        eventID: "2",
        event: "GameJoined",
        userName: "Adolf",
        otherPlayerUserName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T12:55:44"
      }
    ];
  });

  it('should place a legit token on an empty board', () => {
    when = {
      eventID: "3",
      command: "Place",
      row: 0,
      col: 0,
      token: "X",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T12:56:44"
    };

    then = [{
      eventID: "3",
      event: "Placed",
      row: 0,
      col: 0,
      token: "X",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T12:56:44"
    }];

    const actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  it('should respond with an error message when trying to place out of bounds', () => {
    when = {
      eventID: "3",
      command: "Place",
      row: 0,
      col: 3,
      token: "X",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T21:03:44"
    };

    then = [{
      eventID: "3",
      event: "IllegalMove",
      row: 0,
      col: 3,
      token: "X",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T21:03:44"
    }];

    const actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });
});
