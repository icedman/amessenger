'use strict';

// let PokerGame = require('../../pokerworld/PokerGame').PokerGame;
let PokerGame = require('../../pokerworld/game/Game').PokerGame;

class Poker {

    constructor() {
        console.log('new Poker');
        this.game = new PokerGame();
        this.pingRequests = [];

        /*
        // game heartbeat
        setInterval( ()=> {
            
            // console.log('.' + this.game._state + this.pingRequests.length);

            let self = this;
            this.pingRequests.forEach( (req) => {
                setTimeout( function() {
                    console.log('do as requested');
                    
                    req.message.reply = { messages: [] };
                    self.pipe(req.message, req.pubsub)
                    .then( function(message) {

                        // broadcast!
                        message.reply.messages.forEach( (m) => {
                            m.channel = req.message.channel;
                            req.pubsub.publish(m); }
                        );

                    })
                    .catch( ()=> {
                        // drop!
                    });

                }, req.timeout);
            });

            this.pingRequests = [];
            

        }, 2000);
        */
    }

    _pingRequest(message, pubsub, timeout) {

        let isPendingRequest = false;
        this.pingRequests.map( (r)=>{ 
            return r.pubsub;
        }).forEach( (p) => {
            if (p === pubsub) {
                isPendingRequest = true;
            }
        });

        if (isPendingRequest) {
            return;
        }

        this.pingRequests.push({
            internal: true,
            message: message,
            pubsub: pubsub,
            timeout: timeout
        });
    }

    pipe(message, pubsub) {
        console.log('poker pipe: ' + JSON.stringify(message));

        let self = this;

        return new Promise( function(resolve) {
            let stateKey = 'state::' + message.channel;
            let client = pubsub.client();

            client.get(stateKey, function(err, result) {

                let game= self.game;

                let state;
                try {
                    state = JSON.parse(result);
                    game.state = state;
                } catch(e) {
                    game.createGame();
                }

                message.reply = game.ping(message);
                // game.dump(true);

                console.log(message.reply);

                // save updated state
                client.set(stateKey, JSON.stringify(game.state));
                client.expire(stateKey, 60*5); // expire within 5 minutes

                /*
                if (game.state.ping > 0) {
                    self._pingRequest({ 
                        from:'poker',
                        to:message.channel,
                        channel:message.channel,
                        command: [ 0, 'ping' ]
                    }, pubsub, game.state.ping);
                }
                */

                if (message.internal != undefined) {
                    delete message.to;
                    delete message.channel;
                }

                resolve(message);
            });
        });
    }
}

exports.Poker = Poker;
