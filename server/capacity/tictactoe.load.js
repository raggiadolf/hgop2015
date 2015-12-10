'use strict';

var user = require('../fluid-api/tictactoeFluid').user;
var given = require('../fluid-api/tictactoeFluid').given;

it('Should play 1000 games in x seconds', function() {
  var doneCount = 0;
  var gamesToPlay = 250;
  var x = 6;

  this.timeout(x * 1000);

  var QED = function(done) {
    if (gamesToPlay === ++doneCount) {
      done();
    }
  };

  for (var gameID = 0; gameID < gamesToPlay; gameID++) {
    given(user("TestUserOne").createsGame("" + gameID))
      .and(user("TestUserTwo").joinsGame("" + gameID))
      .and(user("TestUserOne").placesMove(1,1))
      .and(user("TestUserTwo").placesMove(0,1))
      .and(user("TestUserOne").placesMove(2,0))
      .and(user("TestUserTwo").placesMove(0,2))
      .and(user("TestUserOne").placesMove(0,0))
      .and(user("TestUserTwo").placesMove(2,2))
      .and(user("TestUserOne").placesMove(1,2))
      .and(user("TestUserTwo").placesMove(1,0))
      .and(user("TestUserOne").placesMove(2,1))
      .expect("GameDrawn").byUser("TestUserOne").isOk(QED);
  }
});
