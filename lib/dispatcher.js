'use strict';

var SocketIO = require('socket.io');
var pubsub = require('./pubsub').PubSub;
var room = require('./room').RoomFactory;

var _singleDispatcher;

class Dispatcher {

    constructor() {
        console.log('Dispatcher');
    }

    initialize(server) {
        console.log('Initialize Dispatcher');

        let io = SocketIO(server);

        room.initialize();
        pubsub.initialize(this);

        io.on('connection', function(socket) {

            console.log('connection');

            socket.on('message', function(message) {

                // channel
                var preprocess = function(message) {
                    return new Promise( function(resolve, reject) {
                        message.channel = message.to;
                        let chAt = message.to.split('@');
                        if (chAt.length > 1) {
                            message.privateTo = chAt[0];
                            message.channel = chAt[1];
                        }

                        // room
                        let rm = message.channel.split(':');
                        if (rm.length > 1) {
                            message.handler = rm[0];
                        }

                        // verify from!
                        // message.from

                        return resolve(message);
                    });
                };

                // pipe to room
                var processRoom = room.pipe;

                var processCommand = function(message) {
                    return new Promise( function(resolve) {

                        // commands
                        let cmd = /^\/([a-z]*) ([a-z0-9:\.]*)/.exec(message.message || '');
                        if (cmd != null) {
                            message.command = cmd;
                            switch(cmd[1]) {
                            case 'join': {
                                let channel = cmd[2];
                                let userChannel = message.from + '@' + channel;

                                console.log(message.from + ' joining .. ' + channel);

                                socket.join(channel);
                                socket.join(userChannel);
                                pubsub.subscribe(channel);

                                // request messages
                                pubsub.lastMessages(channel, 20)
                                .then(function(result) {
                                    let msgs = { from: 'server', to: userChannel, message: 'welcome to ' + channel, 
                                        history: result.map( m => JSON.parse(m) )
                                    };
                                    socket.emit('message', msgs);
                                })
                                .catch(console.log);
                                break;
                            }

                            case 'leave': {
                                let channel = cmd[2];
                                console.log(message.from + ' leaving .. ' + channel);
                                // unscribe if no more socket associated with this channel
                                // pubsub.unsubscribe(channel);
                                // pubsub.unsubscribe(channel); + private user@channel channel
                                break;
                            }
                            }
                        }

                        return resolve(message);

                    });

                };

                preprocess(message)
                .then(processRoom)
                .then(processCommand)
                .then(function(message) {
                    if (message.channel == '') {
                        // drop
                        // message.from = 'server';
                        // socket.emit('message', message);
                        return;
                    }
                    pubsub.publish(message);
                })
                .catch(console.log);

            });

            socket.on('disconnect', function() {
                console.log('disconnect');
            });

        });

        this.io = io;
    }

    dispatch(channel, message) {
        console.log('dispatcher: ' + channel + ': ' + JSON.stringify(message));
        this.io.in(message.to).emit('message', message);
    }
}

if (_singleDispatcher === undefined) {
    _singleDispatcher = new Dispatcher();
}

exports.Dispatcher = _singleDispatcher;
