'use strict';

describe('Factory: TicTacToeState', function() {
  
  var gameState;
  // load the controller's module
  beforeEach(module('tictactoeApp'));
  
  //Initialize the controller and mock scope
  beforeEach(inject(function(_gameState_) {
    gameState = _gameState_();
  }));
  
  it('Should add other player to game state when gameJoined', function() {
    gameState.mutate([{
      event: 'GameJoined',
      userName: 'Adolf',
      gameName: 'TheFirstGame',
      timeStamp: '2015.12.14T18:24:30'
    }]);
    
    expect(gameState.joiningUser).toBe('Adolf');
  });
  
  it('Should store gameid and name from game created in game state.', function() {
    gameState.mutate([{
      event: 'GameCreated',
      gameID: '198299',
      userName: 'Raggi',
      gameName: 'TheSecondGame',
      timeStamp: '2015.12.14T18:28:18'
    }]);
    
    expect(gameState.gameID).toBe('198299');
    expect(gameState.gameName).toBe('TheSecondGame');
    expect(gameState.creatingUser).toBe('Raggi');
  });
  
  it('Should add moves 0,1 to game board', function() {
    gameState.mutate([{
      event: 'Placed',
      userName: 'Raggi',
      gameName: 'TheThirdGame',
      timeStamp: '2015.12.14T18:31:10',
      row: 0,
      col: 1,
      side: 'X'
    }]);
    
    expect(gameState.board[0][1]).toBe('X');
  });
  
  it('Should add move 2,2 to board.', function() {
    gameState.mutate([{
      event: 'Placed',
      userName: 'Adolf',
      gameName: 'TheFourthGame',
      timeStamp: '2015.12.14T18:33:19',
      row: 2,
      col: 2,
      side: 'X'
    }]);
    
    expect(gameState.board[2][2]).toBe('X');
  });
  
  it('Should mark next turn as opposite from last event', function() {
    gameState.me = {side: 'O'};
    gameState.mutate([{
      event: 'Placed',
      userName: 'Raggi',
      gamename: 'TheFifthGame',
      timeStamp: '2015.12.14T18:35:45',
      row: 2,
      col: 2,
      side: 'X'
    }]);
    
    expect(gameState.nextTurn).toBe('O');
  });
  
  it('nextTurn should default to X', function() {
    gameState.me = {side: 'X'};
    gameState.mutate([{
      event: 'GameCreated',
      userName: 'Raggi',
      gameName: 'TheSixthGame',
      timeStamp: '2015.12.14T18:36:39'
    }]);
    
    expect(gameState.nextTurn).toBe('X');
  });
  
  it('GameWon should set nextTurn to GameOver', function() {
    gameState.me = {side: 'X'};
    gameState.mutate([{
      event: 'GameOver',
      winner: 'Raggi',
      gameName: 'TheSeventhGame',
      timeStamp: '2015.12.14T18:38:16'
    }]);
    
    expect(gameState.nextTurn).toBe('GameOver');
    expect(gameState.winner).toBe('Raggi');
  });
  
  it('GameDraw should set nextTurn to GameOver', function() {
    gameState.me = {side: 'X'};
    gameState.mutate([{
      event: 'GameDrawn',
      userName: 'Raggi',
      gameName: 'TheEightGame',
      timeStamp: '2015.12.14T18:40:29'
    }]);
    
    expect(gameState.nextTurn).toBe('GameOver');
    expect(gameState.gameDraw).toBe(true);
  });
});