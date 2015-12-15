'use strict';

describe('Controller: TictactoeControllerCtrl', function() {
  beforeEach(module('tictactoeApp'));
  
  var TictactoeControllerCtrl, scope, httpBackend, http, location, interval;
  
  // Initialize the contorller and a mock scope
  beforeEach(inject(function($injector, $controller, $rootScope, $http, $location, $interval) {
    http = $http;
    interval =  $interval;
    httpBackend = $injector.get('$httpBackend');
    location = $location;
    location.search('gameID', '123');
    location.search('gameSide', 'X');
    
    scope = $rootScope.$new();
    TictactoeControllerCtrl = $controller('TictactoeController', {
      $scope: scope
    });
  }));
  
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });
  
  function getHistory() {
    httpBackend.expectGET('/api/gameHistory/123').respond([{
      event: 'GameCreated',
      gameName: 'Game Number One',
      gameID: '123',
      user: {
        userName: 'Creator'
      }
    }, {
      event: 'GameJoined',
      gameName: 'Game Number One',
      gameID: '123',
      user: {
        userName: 'Joiner'
      }
    }]);
    httpBackend.flush();
  }
  
  it('should generate join url', function() {
    getHistory();
    
    expect(scope.joinUrl).toBe('http://server:80/join/123');
  });
  
  it('should init creator to side X', function() {
    getHistory();
    
    expect(scope.me.userName).toBe('Creator');
  });
  
  it('should init joiner to side O', function() {
    location.search('gameSide', 'O');
    
    getHistory();
    
    expect(scope.me.userName).toBe('Joiner');
  });
  
  it('should post side from current user X', function() {
    getHistory();
    
    httpBackend.expectPOST('/api/placeMove/', {
      gameID: '87687',
      command: 'PlaceMove',
      user: {
        userName: 'Raggi'
      },
      timeStamp: '2015.12.15T10:07:29',
      move: {
        xy: {x: 2, y: 0},
        side: 'X'
      }
    }).respond([
      {
        event: 'MovePlaced',
        user: {
          userName: 'Raggi'
        },
        timeStamp: '2015.12.15T10:07:29',
        move: {
          xy: {x: 2, y: 0},
          side: 'X'
        }
      }
    ]);
    
    scope.gameID = '87687';
    scope.name = 'TheSecondGame';
    
    location.search('gameSide', 'X');
    scope.me = {userName: 'Raggi'};
    scope.gameState.gameID = '87687';
    
    scope.placeMove({x: 2, y: 0});
    httpBackend.flush();
    
    expect(scope.myTurn()).toBe(false);
  });
  
  it('should post side from current usser O', function() {
    location.search('gameSide', 'O');
    
    getHistory();
    httpBackend.expectPOST('/api/placeMove/', {
      gameID: '87687',
      command: 'PlaceMove',
      user: {
        userName: 'Raggi'
      },
      timeStamp: '2015.12.15T10:07:29',
      move: {
        xy: {x: 2, y: 1},
        side: 'O'
      }
    }).respond([
      {
        event: 'MovePlaced',
        user: {
          userName: 'Gummi'
        },
        timeStamp: '2015.12.15T10:07:29',
        move: {
          xy: {x: 2, y: 1},
          side: 'O'
        }
      }
    ]);
    
    scope.gameID = '123';
    scope.name = 'TheSecondGame';
    scope.gameState.nextTurn = 'O';
    
    scope.me = {userName: 'Raggi'};
    scope.gameState.gameID = '87687';
    
    scope.placeMove({x: 2, y: 1});
    httpBackend.flush();
    
    expect(scope.myTurn()).toBe(false);
  });
  
  it('should refresh history once every one second', function() {
    getHistory();
    
    httpBackend.expectGET('/api/gameHistory/123').respond([{
      event: 'GameCreated',
      gameName: 'Game Number One',
      gameID: '123',
      user: {
        userName: 'Creator'
      }
    }, {
      event: 'GameJoined',
      gameName: 'Game Number One',
      gameID: '123',
      user: {
        userName: 'Joiner'
      }
    }]);
    
    interval.flush(2001);
    
    httpBackend.flush();
  });
  
});