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

                self.game.ping(message);
                self.game.dump(true);

                // console.log(JSON.stringify(self.game.state, null, 4));
                // console.log(message.command);
                // console.log('state: ' + JSON.stringify(self.game.state));

                // save updated state
                client.set(stateKey, JSON.stringify(self.game.state));

                // allow dispatcher.. or self-publish
                if (message.ping != undefined) {
                    setTimeout( function() {
                        console.log('ping requested');
                        self.game.ping( { command: [ 0, 'ping' ]});
                    }, message.ping);
                }

                // frame reply
                message.from = 'poker';
                message.message = self.game.state.state;
                if (message.result != undefined) {
                    message.message += ':' + message.result;
                }

                resolve(message);
            });
        });
    }
}

exports.Poker = Poker;
