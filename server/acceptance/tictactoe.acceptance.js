'use strict';

var should = require('should');
var request = require('supertest');
var acceptanceUrl = process.env.ACCEPTANCE_URL;

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
          .expect('Content-Type', 'application/json')
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
    var event = {
      eventID: "1234",
      gameID: "666",
      command: "CreateGame",
      userName: "Raggi",
      gameName: "TheFirstGame",
      timeStamp: "2015.12.09T09:54:17"
    };

    var destination = '/api/createGame';

    var expectation = [{
      "eventID": "1234",
      "gameID": "666",
      "event": "GameCreated",
      "userName": "Raggi",
      "gameName": "TheFirstGame",
      "timeStamp": "2015.12.09T09:54:17"
    }];

    given(event).sendTo(destination).expect(expectation).when(done);
  });
});

function given(event) {
  var command = {
    name: event,
    destination: undefined
  };

  var expectations = [];

  var givenApi = {
    sendTo: function(dest) {
      command.destination = dest;
      return givenApi;
    },
    expect: function(eventName) {
      expectations.push(eventName);
      return givenApi;
    },
    //and: givenApi.expect,
    when: function(done) {
      var req = request(acceptanceUrl);
      req
        .post(command.destination)
        .type('json')
        .send(command.event)
        .end(function(err, res) {
          if(err) return done(err);
          request(acceptanceUrl)
            .get('/api/gameHistory/' + command.event.gameID)
            .expect(200)
            .expect('Content-Type', 'application/json')
            .end(function(err, res) {
              if(err) return done(err);
              res.body.should.be.instanceof(Array);
              should(res.body).eql(expectations);
            });
        });
      done();
    }
  };
  return givenApi;
}
