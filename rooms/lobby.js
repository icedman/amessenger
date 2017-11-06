'use strict';

class Lobby {

    constructor() {
        console.log('new Lobby');
    }

    pipe(message, pubsub) {
        return new Promise( function(resolve) {
            var stateKey = 'state::' + message.channel;
            var client = pubsub.client();
            client.get(stateKey, function(err, result) {
                console.log('previous state: ' + result);
                client.set(stateKey, JSON.stringify(message));
                resolve(message);
            });
        });
    }
}

exports.Lobby = Lobby;
