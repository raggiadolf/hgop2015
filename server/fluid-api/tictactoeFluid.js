'use strict';

var should = require('should');
var request = require('supertest');
var acceptanceUrl = process.env.ACCEPTANCE_URL;

var uuid = require('node-uuid');

function finish(done, commands, expectedEvent, compareResults) {
  if(commands.length === 0) return compareResults(expectedEvent);

  var cmd = commands.shift();

  var req = request(acceptanceUrl);
  req
    .post(cmd.url)
    .type('json')
    .send(cmd)
    .end(function(err, res) {
      if(err) done(err);
      finish(done, commands, expectedEvent, compareResults);
    });
}

function given(event) {
  var eEvent = {
    name: event,
    userName: undefined,
    gameID: event.command.gameID
  };

  var commands = [];
  commands.push(event.command);

  var givenApi = {
    expect: function(eventName) {
      eEvent.name = eventName;
      return givenApi;
    },
    and: function(event) {
      event.command.gameID = eEvent.gameID;
      commands.push(event.command);
      return givenApi;
    },
    byUser: function(userName) {
      eEvent.userName = userName;
      return givenApi;
    },
    /*jshint loopfunc: true */
    isOk: function(done) {
      finish(done, commands, eEvent, function(expectedEvent) {
        var historyReq = request(acceptanceUrl);
        historyReq
          .get('/api/gameHistory/' + expectedEvent.gameID)
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(req, res) {
            should(res.body[res.body.length - 1].event).eql(expectedEvent.name);
            should(res.body[res.body.length - 1].userName).eql(expectedEvent.userName);
            should(res.body[res.body.length - 1].gameID).eql(expectedEvent.gameID);
            done();
          })
      });
    }
  };
  return givenApi;
}

function user(userName) {
  var action = {
    createsGame: function(gameID) {
      this.command.gameID = gameID;
      this.command.command = "CreateGame";
      this.command.url = "/api/createGame";
      return action;
    },
    named: function(gameName) {
      this.command.gameName = gameName;
      return action;
    },
    joinsGame: function(gameID) {
      this.command.gameID = gameID;
      this.command.command = "JoinGame";
      this.command.url = "/api/joinGame";
      return action;
    },
    placesMove: function(col, row) {
      this.command.command = "Place";
      this.command.row = row;
      this.command.col = col;
      this.command.url = "/api/placeMove";
      return action;
    },
    command: {
      eventID: uuid.v4(),
      gameID: undefined,
      command: undefined,
      userName: userName,
      gameName: undefined,
      timeStamp: new Date(),
      url: undefined
    }
  }
  action.command.userName = userName;
  return action;
}

module.exports.user = user;
module.exports.given = given;
