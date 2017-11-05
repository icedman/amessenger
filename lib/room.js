'use strict';

var _singleRoomFactory;

class RoomFactory {

    constructor() {
        console.log('RoomFactory');
    }

    initialize() {
        this.rooms = [];
    }

    pipe(message) {
        return new Promise( function(resolve) {
            console.log(message);
            return resolve(message);
        });
    }
}

if (_singleRoomFactory === undefined) {
    _singleRoomFactory = new RoomFactory();
}

exports.RoomFactory = _singleRoomFactory;
