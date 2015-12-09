'use strict';

var tictactoeCommandHandler = require('./tictactoeCommandHandler');

describe('join game command', function() {
  var given, when, then;

  it('should join game', function() {
    given = [{
      eventID: "2",
      event: "GameCreated",
      userName: "Raggi",
      gameName: "TestGame",
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
      gameName: "TestGame",
      timeStamp: "2015.12.03T13:26:20"
    }];

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });

  it('should not allow joining of a game that does not exist', function() {
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

    var actualEvents = tictactoeCommandHandler(given).executeCommand(when);

    JSON.stringify(actualEvents).should.be.exactly(JSON.stringify(then));
  });
});
