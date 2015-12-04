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

  it('should respond with an error message when trying to place on top of a previously placed token', () => {
    given.push({
      eventID: "3",
      event: "Placed",
      row: 1,
      col: 1,
      token: "X",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T21:27:34"
    });

    when = {
      eventID: "4",
      command: "Place",
      row: 1,
      col: 1,
      token: "O",
      userName: "Adolf",
      gameName: "TestGame",
      timeStamp: "2015.12.03T21:28:17"
    };

    then = [{
      eventID: "4",
      event: "IllegalMove",
      row: 1,
      col: 1,
      token: "O",
      userName: "Adolf",
      gameName: "TestGame",
      timeStamp: "2015.12.03T21:28:17"
    }];

    const actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  it('should respond with an error when trying to place out of turn', () => {
    given.push({
      eventID: "3",
      event: "Placed",
      row: 1,
      col: 1,
      token: "X",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T21:27:34"
    });

    when = {
      eventID: "4",
      command: "Place",
      row: 0,
      col: 1,
      token: "X",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T21.30:39"
    };

    then = [{
      eventID: "4",
      event: "NotYourTurn",
      row: 0,
      col: 1,
      token: "X",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T21.30:39"
    }];

    const actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  describe('Winning moves', () => {
    it('should register a win horizontally', () => {
      given.push({
        eventID: "3",
        event: "Placed",
        row: 0,
        col: 0,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:27:34"
      },
      {
        eventID: "4",
        event: "Placed",
        row: 0,
        col: 1,
        token: "O",
        userName: "Adolf",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:28:34"
      },
      {
        eventID: "5",
        event: "Placed",
        row: 1,
        col: 0,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:29:34"
      },
      {
        eventID: "6",
        event: "Placed",
        row: 0,
        col: 2,
        token: "O",
        userName: "Adolf",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:30:34"
      });

      when = {
        eventID: "7",
        command: "Place",
        row: 2,
        col: 0,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21.30:39"
      }

      then = [{
        eventID: "7",
        event: "Placed",
        row: 2,
        col: 0,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21.30:39"
      },
      {
        eventID: "7",
        event: "GameOver",
        token: "X",
        winner: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21.30:39"
      }];

      const actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });
  });
});
