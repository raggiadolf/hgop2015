'use strict';

var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('place token command', function() {
  var given, when, then;

  beforeEach(function() {
    given = [{
        eventID: "1",
        gameID: "999",
        event: "GameCreated",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T12:54:44"
      },
      {
        eventID: "2",
        gameID: "999",
        event: "GameJoined",
        userName: "Adolf",
        otherPlayerUserName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T12:55:44"
      }
    ];
  });

  it('should place a legit token on an empty board', function() {
    when = {
      eventID: "3",
      gameID: "999",
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
      gameID: "999",
      event: "Placed",
      row: 0,
      col: 0,
      token: "X",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T12:56:44"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  it('should respond with an error message when trying to place out of bounds', function() {
    when = {
      eventID: "3",
      gameID: "999",
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
      gameID: "999",
      event: "IllegalMove",
      row: 0,
      col: 3,
      token: "X",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T21:03:44"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  it('should respond with an error message when trying to place on top of a previously placed token', function() {
    given.push({
      eventID: "3",
      gameID: "999",
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
      gameID: "999",
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
      gameID: "999",
      event: "IllegalMove",
      row: 1,
      col: 1,
      token: "O",
      userName: "Adolf",
      gameName: "TestGame",
      timeStamp: "2015.12.03T21:28:17"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  it('should respond with an error when trying to place out of turn', function() {
    given.push({
      eventID: "3",
      gameID: "999",
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
      gameID: "999",
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
      gameID: "999",
      event: "NotYourTurn",
      row: 0,
      col: 1,
      token: "X",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T21.30:39"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  describe('Winning moves', function() {
    it('should register a win horizontally', function() {
      given.push({
        eventID: "3",
        gameID: "999",
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
        gameID: "999",
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
        gameID: "999",
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
        gameID: "999",
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
        gameID: "999",
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
        gameID: "999",
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
        gameID: "999",
        event: "GameOver",
        token: "X",
        winner: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21.30:39"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });

    it('should register a win vertically', function() {
      given.push({
        eventID: "3",
        gameID: "999",
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
        gameID: "999",
        event: "Placed",
        row: 1,
        col: 0,
        token: "O",
        userName: "Adolf",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:29:34"
      },
      {
        eventID: "5",
        gameID: "999",
        event: "Placed",
        row: 0,
        col: 1,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:30:24"
      },
      {
        eventID: "6",
        gameID: "999",
        event: "Placed",
        row: 2,
        col: 0,
        token: "O",
        userName: "Adolf",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:31:16"
      });

      when = {
        eventID: "7",
        gameID: "999",
        command: "Place",
        row: 0,
        col: 2,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21.32:39"
      };

      then = [{
        eventID: "7",
        gameID: "999",
        event: "Placed",
        row: 0,
        col: 2,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21.32:39"
      },
      {
        eventID: "7",
        gameID: "999",
        event: "GameOver",
        token: "X",
        winner: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21.32:39"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });

    it('should register a win diagonally', function() {
      given.push({
        eventID: "3",
        gameID: "999",
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
        gameID: "999",
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
        gameID: "999",
        event: "Placed",
        row: 1,
        col: 1,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:29:59"
      },
      {
        eventID: "6",
        gameID: "999",
        event: "Placed",
        row: 0,
        col: 2,
        token: "O",
        userName: "Adolf",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:30:16"
      });

      when = {
        eventID: "7",
        gameID: "999",
        command: "Place",
        row: 2,
        col: 2,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21.38:39"
      };

      then = [{
        eventID: "7",
        gameID: "999",
        event: "Placed",
        row: 2,
        col: 2,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21.38:39"
      },
      {
        eventID: "7",
        gameID: "999",
        event: "GameOver",
        token: "X",
        winner: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21.38:39"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });
  });

  describe('When game drawn', function() {
    it('should return gamedrawn when the game is drawn', function() {
      given.push({
        eventID: "3",
        gameID: "999",
        event: "Placed",
        row: 1,
        col: 1,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:27:34"
      },
      {
        eventID: "4",
        gameID: "999",
        event: "Placed",
        row: 0,
        col: 1,
        token: "O",
        userName: "Adolf",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:27:34"
      },
      {
        eventID: "5",
        gameID: "999",
        event: "Placed",
        row: 2,
        col: 0,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:27:34"
      },
      {
        eventID: "6",
        gameID: "999",
        event: "Placed",
        row: 0,
        col: 2,
        token: "O",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:27:34"
      },
      {
        eventID: "7",
        gameID: "999",
        event: "Placed",
        row: 0,
        col: 0,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:27:34"
      },
      {
        eventID: "8",
        gameID: "999",
        event: "Placed",
        row: 2,
        col: 2,
        token: "O",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:27:34"
      },
      {
        eventID: "9",
        gameID: "999",
        event: "Placed",
        row: 1,
        col: 2,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:27:34"
      },
      {
        eventID: "10",
        gameID: "999",
        event: "Placed",
        row: 1,
        col: 0,
        token: "O",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21:27:34"
      });

      when = {
        eventID: "11",
        gameID: "999",
        command: "Place",
        row: 2,
        col: 1,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21.38:39"
      };

      then = [{
        eventID: "11",
        gameID: "999",
        event: "Placed",
        row: 2,
        col: 1,
        token: "X",
        userName: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21.38:39"
      },
      {
        eventID: "11",
        gameID: "999",
        event: "GameDrawn",
        token: "X",
        lastUser: "Raggi",
        gameName: "TestGame",
        timeStamp: "2015.12.03T21.38:39"
      }];

      var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

      JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
    });
  });
});
