'use strict';

var app = require('./index');
var http = require('http');

var server;

/*
 * Create and start HTTP server.
 */

server = http.createServer(app);

var io = require('socket.io')(server);

server.listen(process.env.PORT || 8000);
server.on('listening', function () {
    console.log('Server listening on http://localhost:%d', this.address().port);
});

io.on('connection', function(socket) {
    
    console.log('connected...');

    socket.on('send', function(message) {

        console.log('send received..' + message);

        // echo!
        io.emit('messages', 'echo ' + message);
        
    });
});
