'use strict';

var should = require('should');
var request = require('supertest');
var acceptanceUrl = process.env.ACCEPTANCE_URL;

var uuid = require('node-uuid');

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
    isOk: function(done) {
      for(var i = 0; i < commands.length; i++) {
        var req = request(acceptanceUrl);
        req
          .post(commands[i].url)
          .type('json')
          .send(commands[i])
          .end(function(err, res) {
            if(err) done(err);
          });
      }

      var historyReq = request(acceptanceUrl);
      historyReq
        .get('/api/gameHistory/' + eEvent.gameID)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(req, res) {
          should(res.body[res.body.length - 1].event).eql(eEvent.name);
          should(res.body[res.body.length - 1].userName).eql(eEvent.userName);
          should(res.body[res.body.length - 1].gameID).eql(eEvent.gameID);
          done();
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
