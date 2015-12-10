'use strict';

var should = require('should');
var request = require('supertest');
var acceptanceUrl = process.env.ACCEPTANCE_URL;

var given = require('../fluid-api/tictactoeFluid').given;
var user = require('../fluid-api/tictactoeFluid').user;

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
      .and(user("Adolf").placesMove(0,1))
      .and(user("Raggi").placesMove(2,0))
      .and(user("Adolf").placesMove(0,2))
      .and(user("Raggi").placesMove(0,0))
      .and(user("Adolf").placesMove(2,2))
      .and(user("Raggi").placesMove(1,2))
      .and(user("Adolf").placesMove(1,0))
      .and(user("Raggi").placesMove(2,1))
      .expect("GameDrawn").byUser("Raggi").isOk(done);
  });
});
