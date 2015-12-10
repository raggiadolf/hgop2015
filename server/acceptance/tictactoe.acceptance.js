'use strict';

var should = require('should');
var request = require('supertest');
var acceptanceUrl = process.env.ACCEPTANCE_URL;

var uuid = require('node-uuid');

describe('TEST ENV GET /api/gameHistory', function() {

  it('should have ACCEPTANCE_URL environment variable exported.', function() {
    acceptanceUrl.should.be.ok;
  });

  it('should execute same test using old style', function(done) {
    var command = {
      eventID: "1234",
      gameID: "999",
      command: "CreateGame",
      userName: "Raggi",
      gameName: "TheFirstGame",
      timeStamp: "2015.12.09T09:54:17"
    };

    var req = request(acceptanceUrl);
    req
      .post('/api/createGame')
      .type('json')
      .send(command)
      .end(function(err, res) {
        if (err) return done(err);
        request(acceptanceUrl)
          .get('/api/gameHistory/999')
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if(err) return done(err);
            res.body.should.be.instanceof(Array);
            should(res.body).eql(
              [{
                "eventID": "1234",
                "gameID": "999",
                "event": "GameCreated",
                "userName": "Raggi",
                "gameName": "TheFirstGame",
                "timeStamp": "2015.12.09T09:54:17"
              }]);
            done();
          });
      });
  });

  it('should execute fluid API test', function(done) {
    given(user("Raggi").createsGame("TestGameID"))
      .expect("GameCreated").byUser("Raggi").isOk(done);
  });

  it('should play game until won or drawn', function(done) {
    given(user("Raggi").createsGame("GameIDOne").named("TheFirstGame"))
      .and(user("Adolf").joinsGame("GameIDOne"))
      .and(user("Raggi").placesMove(1,1))
      .expect("Placed").byUser("Raggi").isOk(done);
  });
});

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
        console.log('sending command:', commands[i]);
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
