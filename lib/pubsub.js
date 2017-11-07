'use strict';

var moment = require('moment');
var redis = require('ioredis');

var _singlePubSub;

class PubSub {

    constructor() {
        console.log('PubSub');
    }

    initialize(dispatcher) {
        console.log('Initialize PubSub');

        this.sub = redis.createClient();
        this.pub = redis.createClient();

        this.sub.on('message', function (channel, message) {
            dispatcher.dispatch(channel, JSON.parse(message));
        });
    }

    subscribe(channel) {
        this.sub.subscribe(channel, function(err, count) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(channel + ': ' + count);
        });
    }

    unsubscribe(channel) {
        this.sub.unsubscribe(channel, function(err, count) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(channel + ': ' + count);
        });
    }

    publish(message) {
        var date = moment.now();
        var msg = JSON.stringify(message);
        message.timestamp = date;
        this.pub.zadd(message.channel, date, msg);
        this.pub.publish(message.channel, msg);
        this.pub.expire(message.channel, 60*5);
        // console.log('called publish..' + msg);
    }

    lastMessages(channel, count) {
        return this.pub.zrange(channel, -1 * count, -1);
    }

    client() {
        return this.pub;
    }
}

if (_singlePubSub === undefined) {
    _singlePubSub = new PubSub();
}

exports.PubSub = _singlePubSub;
