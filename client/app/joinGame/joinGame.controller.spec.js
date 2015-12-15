'use strict';

describe('Controller: JoinGameCtrl', function() {
  // load the controller's module
  beforeEach(module('tictactoeApp'));
  
  beforeEach(function() {
    module(function($provide) {
      var guids = ['987', '1234'];
      
      $provide.value('guid', function() {
        return guids.pop();
      });
    });
  });
  
  
  var JoinGameCtrl, scope;
  var httpBackend;
  var location;
  
  // Initialize the controller and mock scope
  beforeEach(inject(function($controller, $rootScope, $httpBackend, $location, $state) {
    httpBackend = $httpBackend;
    location = $location;
    
    $state.params.gameID = '123';
    
    scope = $rootScope.$new();
    JoinGameCtrl = $controller('JoinGameCtrl', {
      $scope: scope
    });
  }));
  
  it('should ask to join game if game id already in scope, and assign me to O', function() {
    httpBackend.expectGET('/api/gameHistory/123').respond([{
      event: 'GameCreated',
      name: 'Game Number One',
      gameID: '123',
      eventID: '6543'
    }]);
    httpBackend.expectGET('app/createGame/createGame.html').respond('');
    
    httpBackend.flush();
    
    console.log('here');
    
    httpBackend.expectPOST('/api/joinGame/', {
      eventID: '1234',
      gameID: '123',
      command: 'JoinGame',
      user: {
        userName: 'Raggi',
        side: 'O'
      },
      timeStamp: '2015.12.14T22:04:03'
    }).respond([
      {event: 'GameJoined'}
    ]);
    
    scope.userName = 'Raggi';
    
    scope.joinGame();
    
    httpBackend.expectGET('app/tictactoeController/tictactoe.html').respond('');
    httpBackend.flush();
    
    expect(location.search().gameSide.toBe('O'));
    expect(location.search().gameID).toBe('123');
    epxect(location.path()).toBe('/tictactoe');
  });
});