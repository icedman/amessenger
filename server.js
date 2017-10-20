'use strict';

var app = require('./index');
var http = require('http');
var moment = require('moment');

var redis = require('ioredis');
// var redis_address = process.env.REDIS_ADDRESS || 'redis://127.0.0.1:6379';
var sub = redis.createClient(), pub = redis.createClient();
var channel_history_max = 10;

var room = 'global';
var server;

/*
 * Create and start HTTP server.
 */
server = http.createServer(app);

var io = require('socket.io')(server);

sub.on('subscribe', function (channel, count) {
    console.log(channel + ': ' + count);
});

sub.on('message', function (channel, message) {
    var msg = JSON.parse(message);
    var date = moment.now();
    
    pub.zadd('message_' + room, date, message);

    if ((msg.to || '').length > 0) {
        io.in(channel).emit('messages', msg);
    } else {
        io.emit('messages', msg);
    }
});

sub.subscribe(room);

server.listen(process.env.PORT || 8000);
server.on('listening', function () {
    console.log('Server listening on http://localhost:%d', this.address().port);
});

io.on('connection', function(socket) {
    
    var _username = 'anonymous';
    
    console.log('connected...');
    socket.on('send', function(message) {
        if ((message.to || '').length > 0) {
            pub.publish(message.to, JSON.stringify( { from: _username, to: message.to, message: message.message } ));
        } else {
            pub.publish(room, JSON.stringify( { from: _username, to: message.to, message: message.message } ));
        }
    });

    socket.on('disconnect', function() {
        sub.unsubscribe(_username);
        // pub.publish(room, JSON.stringify( { message: 'disconnected ..' + _username } ));
    });

    socket.on('join', function(username) {

        _username = username;
        socket.join(_username);
        sub.subscribe(_username);

        var get_messages = pub.zrange('message_' + room, -1 * channel_history_max, -1)
        .then(function(result) {
            return result.map(function(x) {
                return JSON.parse(x);
            });
        });
        
        Promise.all([get_messages]).then(function(messages) {
            var msgs = messages[0];
            msgs.forEach(function(m) {
                if ((m.from || '').length > 0 && (m.to === _username || m.to === '')) {
                    // pub.publish(_username, JSON.stringify(m));
                    io.in(_username).emit('messages', m);
                }
            });

            io.emit('messages', {message:_username + ' has joined'});
            io.in(_username).emit('messages', {message:'Welcome, ' + _username});

            // pub.publish(_username, JSON.stringify({ to:_username, message:'Welcome, ' + _username}));
        })
        .catch(function(e) {
            console.log('error:' + e);
        });

    });
});

