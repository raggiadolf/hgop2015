var _ = require('lodash');
var q = require('q');

module.exports = function (eventStore, commandHandler) {
  return {
    handleCommand: function (command) {
      var defer = q.defer();
      eventStore.loadEvents(command.gameID).then(function (eventStream) {
        var events;
        try {
          events = commandHandler(eventStream).executeCommand(command);
        } catch (e) {
          defer.reject(e);
        }

        eventStore.storeEvents(command.gameID, events).then(function () {
          defer.resolve(events);
        }, function (err) {
          defer.reject(err);
        });
      });
      return defer.promise;
    }
  };
};
