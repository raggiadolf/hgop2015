'use strict';

const tictactoeCommandHandler = function(events) {
  return {
    executeCommand: function() {
      return [{
        eventID: "1",
        event: "GameCreated",
        userName: "Raggi",
        timeStap: "2015.12.03T12:54:44"
      }];
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
