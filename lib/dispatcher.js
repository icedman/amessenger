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

        pubsub.initialize(this);
        room.initialize();

        io.on('connection', function(socket) {

            console.log('connection');

            socket.on('message', function(message) {

                // channel
                var preprocess = function(msg) {
                    msg.channel = msg.to;
                    let chAt = msg.to.split('@');
                    if (chAt.length > 1) {
                        msg.privateTo = chAt[0];
                        msg.channel = chAt[1];
                    }

                    // room
                    let rm = msg.channel.split(':');
                    msg.handler = msg.channel;
                    if (rm.length > 1) {
                        msg.handler = rm[0];
                    }

                    // verify from!
                    // msg.from

                    let cmd = /^\/([a-z]*) ([a-z0-9:\.@]*)/.exec(msg.message || '');
                    if (cmd != null) {
                        msg.command = cmd;
                    }

                    return Promise.resolve(msg);
                };

                // pipe to room
                var processRoom = room.pipe;

                var processCommand = function(msg) {

                    // commands
                    if (msg.command) {
                        var cmd = msg.command;
                        switch(cmd[1]) {
                        case 'join': {
                            let channel = cmd[2];
                            let userChannel = msg.from + '@' + channel;

                            console.log(msg.from + ' joining .. ' + channel);

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
                            console.log(msg.from + ' leaving .. ' + channel);
                            // unscribe if no more socket associated with this channel
                            // pubsub.unsubscribe(channel);
                            // pubsub.unsubscribe(channel); + private user@channel channel
                            break;
                        }
                        }
                    }

                    return Promise.resolve(msg);

                };

                preprocess(message)
                .then(function(msg) {
                    return processRoom(msg, pubsub);
                })
                .then(processCommand)
                .then(function(msg) {
                    if (msg.channel == '') {
                        // drop
                        // msg.from = 'server';
                        // socket.emit('msg', msg);
                        return;
                    }
                    pubsub.publish(msg);
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
