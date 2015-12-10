'use strict';

var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('create game command', function() {
  var given, when, then;

  it('should create game', function() {
    given = [];

    when = {
      eventID: "1",
      gameID: "999",
      command: "CreateGame",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T12:54:44"
    };

    then = [{
      eventID: "1",
      gameID: "999",
      event: "GameCreated",
      userName: "Raggi",
      gameName: "TestGame",
      timeStamp: "2015.12.03T12:54:44"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  it('should create a second game with different user and different timestamp', function() {
    given = [];

    when = {
      eventID: "4",
      gameID: "666",
      command: "CreateGame",
      userName: "Adolf",
      gameName: "SecondTestGame",
      timeStamp: "2015.12.03T13:41:10"
    };

    then = [{
      eventID: "4",
      gameID: "666",
      event: "GameCreated",
      userName: "Adolf",
      gameName: "SecondTestGame",
      timeStamp: "2015.12.03T13:41:10"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });
});
