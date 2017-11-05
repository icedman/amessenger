'use strict';

var app = require('./index');
var http = require('http');
var dispatcher = require('./lib/dispatcher').Dispatcher;

/*
 * Create and start HTTP server.
 */
var server = http.createServer(app);

dispatcher.initialize(server);

server.listen(process.env.PORT || 8000);
server.on('listening', function () {
    console.log('Server listening on http://localhost:%d', this.address().port);
});
