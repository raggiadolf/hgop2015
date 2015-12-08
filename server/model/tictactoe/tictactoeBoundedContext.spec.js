var should = require('should');
var _ = require('lodash');
var q = require('q');

function resolvedPromise(value) {
  var defer = q.defer();
  defer.resolve(value);
  return defer.promise;
}

describe('tictactoe game context', function() {
  it('should route command to instantiated tictactoe game with event stream from store and return and store generated events. ' +
    'Test using fakes/stubs.', function(done) {

      var calledWithEventStoreId;
      var storedEvents;
      var eventStoreStub = {
        loadEvents: function(aggregateId) {
          calledWithEventStoreId = aggregateId;
          return resolvedPromise([]);
        },
        storeEvents: function(aggregateId, events) {
          storedEvents = events;
          return resolvedPromise(events);
        }
      };

      var executedCommand = {};

      var tictactoe = function(history) {
        return {
          executeCommand: function(command) {
            executedCommand = command;
            return [];
          }
        }
      };

      var commandHandlers = tictactoe;
      var boundedContext = require('./tictactoeBoundedContext')(eventStoreStub, commandHandlers);

      var emptyCommand = {
        gameID: "123"
      };

      var events;
      boundedContext.handleCommand(emptyCommand).then(function(ev) {
        events = ev;
        should(executedCommand.gameID).be.exactly("123");
        should(calledWithEventStoreId).be.exactly("123");
        should(events.length).be.exactly(0);
        should(storedEvents).be.exactly(events);
        done();
      });
    });

    it('should route command to instantiated tictactoe game with event stream from store and return generated events, ' +
      'using mock style tests.', function(done) {
        var jm = require('jsmockito').JsMockito;
        jm.Integration.importTo(global);
        // global spy,when

        var mockStore = jm.spy({
          loadEvents: function() {
            return resolvedPromise([]);
          },
          storeEvents: function(events) {
            return resolvedPromise(events);
          }
        });

        var mockTicTacToe = jm.spy({
          executeCommand: function() {
            return resolvedPromise([]);
          }
        });

        var commandHandlers = function() {
          return mockTicTacToe;
        };
        var boundedContext = require('./tictactoeBoundedContext')(mockStore, commandHandlers);

        var emptyCommand = {
          gameID: "123"
        };

        boundedContext.handleCommand(emptyCommand).then(function() {
          jm.verify(mockStore).loadEvents('123');
          jm.verify(mockStore).storeEvents('123');

          jm.verify(mockTicTacToe).executeCommand(emptyCommand);

          done();
        });
    });
});
