'use strict';

var _singleRoomFactory;
var rooms = {
    'lobby': require('../rooms/lobby').Lobby,
    'poker': require('../rooms/poker').Poker
};

class RoomFactory {

    constructor() {
        console.log('RoomFactory');
    }

    initialize() {
        this.handlers = {};
    }

    pipe(message, pubsub) {

        var self = _singleRoomFactory;

        if (rooms[message.handler] !== undefined) {
            if (self.handlers[message.handler] === undefined) {
                self.handlers[message.handler] = new (rooms[message.handler])();
            }
            let phandler = self.handlers[message.handler];
            phandler.pipe.bind(phandler);
            return phandler.pipe(message, pubsub);
        }

        return Promise.resolve(message);
    }
}

if (_singleRoomFactory === undefined) {
    _singleRoomFactory = new RoomFactory();
}

exports.RoomFactory = _singleRoomFactory;
