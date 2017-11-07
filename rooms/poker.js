'use strict';

var PokerGame = require('../../pokerworld/PokerGame').PokerGame;

class Poker {

    constructor() {
        console.log('new Poker');
        this.game = new PokerGame();
    }

    pipe(message, pubsub) {
        console.log('poker pipe: ' + JSON.stringify(message));

        var self = this;

        return new Promise( function(resolve) {
            var stateKey = 'state::' + message.channel;
            var client = pubsub.client();

            client.get(stateKey, function(err, result) {

                let state;
                try {
                    state = JSON.parse(result);
                    self.game.state = state;
                } catch(e) {
                    self.game.createGame();
                }

                message.reply = self.game.ping(message);
                // self.game.dump(true);

                console.log(message.reply);

                // save updated state
                client.set(stateKey, JSON.stringify(self.game.state));
                client.expire(stateKey, 60*5); // expire within 5 minutes

                // allow dispatcher.. or self-publish
                if (self.game.state.ping > 0) {
                    console.log('ping requested');
                    setTimeout( function() {
                        console.log('do ping');
                        self.game.ping( { command: [ 0, 'ping' ]});
                    }, self.game.state.ping);
                }

                resolve(message);
            });
        });
    }
}

exports.Poker = Poker;
