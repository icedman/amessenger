(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var suitNotations = [ 'S','C','H','D' ];
var suitCharacters = ['♠', '♣', '♥', '♦'];

var rankNotations = [
    'A','2','3','4','5','6','7','8','9','T','J','Q','K'
];

class FastStack
{
    constructor(fc) {
        this.fc = fc;
        this.cards = new Array(52);
        this.size = 0;
    }

    get FastCards() {
        return this.fc;
    }
    
    get Cards() {
        return this.cards.slice(0,this.size);
    }

    createDeck()
    {
        for (var i = 0; i < 52; i++)
            this.cards[i] = i;
        this.size = 52;
    }

    cardAt(i)
    {
        return this.cards[i];
    }

    peset(s)
    {
        this.size = s;
    }

    popCard()
    {
        if (this.size == 0)
            return -1;
        this.size--;
        return this.cards[this.size];
    }

    pushCard(c)
    {
        if (this.size == 52)
            return;
        this.cards[this.size] = c;
        this.size++;
    }

    pushCards(c)
    {
        for (var i = 0; i < c.length; i++)
        {
            if (c[i] < 0)
                break;
            this.pushCard(c[i]);
        }
    }

    pushStack(fs)
    {
        this.pushCards(fs.cards);
    }

    removeCards(c)
    {
        for (var i = 0; i < c.length; i++)
        {
            if (c[i] == -1)
                break;
            for (var j = 0; j < this.cards.length; j++)
            {
                if (c[i] == this.cards[j])
                {
                    this.cards[i] = -1;
                    this.size--;
                    break;
                }
            }
        }

        // Array.Sort(cards, ltCompare);
    }

    get Count() 
    {
        return this.size;
    }

    clear() {
        this.size = 0;
    }

    _shuffle() {
        // slow
        var array = this.cards;
        for (let i = this.size - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    shuffle() {

        var array = this.cards;
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    encode(prettify)
    {
        var s = '';
        for (var i = 0; i < this.Count; i++)
        {
            if (s !== '')
                s += ' ';
            var c = this.cards[i];

            s += rankNotations[this.fc.ranks[c] - 1];
            if (prettify !== true) {
                s += suitNotations[this.fc.suits[c]];
            } else {
                s += suitCharacters[this.fc.suits[c]];
            }
        }
        return s;
    }

    encodePretty()
    {
        return this.encode(true);
    }

    decode(d)
    {
        var size = this.size;
        var r = 0;
        var s = 0;
        for (var i = 0; i < d.length; i++)
        {
            var c = d[i].toUpperCase();
            switch (c)
            {
            case 'A': r = 1; break;
            case '2': r = 2; break;
            case '3': r = 3; break;
            case '4': r = 4; break;
            case '5': r = 5; break;
            case '6': r = 6; break;
            case '7': r = 7; break;
            case '8': r = 8; break;
            case '9': r = 9; break;
            case 'T': r = 10; break;
            case 'J': r = 11; break;
            case 'Q': r = 12; break;
            case 'K': r = 13; break;
            case 'S': s = 0; this.cards[size] = (s * 13) + (r - 1); size++; break;
            case 'C': s = 1; this.cards[size] = (s * 13) + (r - 1); size++; break;
            case 'H': s = 2; this.cards[size] = (s * 13) + (r - 1); size++; break;
            case 'D': s = 3; this.cards[size] = (s * 13) + (r - 1); size++; break;
            }
        }
        this.size = size;
    }
}

exports.FastStack = FastStack;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let FastHand = __webpack_require__(2);
let FastCards = FastHand.FastCards;
let FastEvaluator = FastHand.FastEvaluator;
// let Combinations = FastHand.Combinations;

class Game {
    //

    createGame() {
        console.log('create game');

        this._state = {

            game: 'poker',
            // seats
            dealer: 0,
            token: 0,
            smallBlind: 0,
            bigBlind: 0,
            settings: {
                // amounts
                smallBlind: 10,
                bigBlind: 20
            },
            deck: [],
            community: [],
            table: {
                players: []
            },
            state: '',
            round: {},
            pot: 0
            // history: [],
            // messages: []

        };

        for(let i=0;i<10;i++) {
            this._state.table.players.push(null);
        }
    }

    _getPlayer(idx) {
        if (this._state.table.players.length >= idx) {
            return null;
        }
        return this._state.table.players[idx];
    }

    _getCurrentPlayer() {
        this._state.token = this._state.token % 10;
        return this._state.table.players[this._state.token];
    }

    _getCurrentDealer() {
        this._state.dealer = this._state.dealer % 10;
        return this._state.table.players[this._state.dealer];
    }

    _getPlayerFromName(name) {
        for (let p of this._state.table.players) {
            if (p === null) {
                continue; 
            }
            if (p.player == name)
                return p;
        }
        return null;
    }

    _saveHistory() {
        // this._state.history.push(Object.assign({}, this._state.round));
    }

    _saveAction(msg, valid) {
        // if (valid) {
        //     this._state.round.actions.push(msg);
        // }
        // else {
        //     this._state.messages.push(msg);
        // }
    }

    _cleanup() {
        // make sure to cleanup after every game!
        for (let p of this._state.table.players) {
            if (p === null) {
                continue; 
            }

            p.ready = false;
            p.active = false;
            delete p.winner;
            delete p.poker;
            delete p.hole;
            delete p._hole;
        }

        this._state.pot = 0;
        this._state.history = [];
        this._state.messages = [];
        this._state.deck = [];
        this._state.community = [];
        delete this._state._community;
        delete this._state.smallBlind;
        delete this._state.bigBlind;
    }

    setWait() {

        if (this._state.state == 'waiting') {
            return;
        }

        this._state.state = 'waiting';
        this._state.round = { state: this._state.state, actions: [] };

        console.log('>>>> waiting');

        this._reply(this._ping.channel, 'Waiting...');

        this._cleanup();

        // fast cards... (safely tuck this away)
        let deck = FastCards.createEmptyStack();
        deck.createDeck();
        deck.shuffle();
        this._state.deck = deck.Cards;

        this._requestPing(1000);
    }

    _updateWaiting() {

        // check for readiness
        let playersReady = 0;
        for (let p of this._state.table.players) {
            if (p === null) {
                continue; 
            }
            if (p.ready) {
                p.active = true;
                playersReady++;
            }
        }

        console.log('players ready: ' + playersReady);

        if (playersReady > 2) {
            this.setBlinds();
        }

        this._requestPing(5000);
    }

    setBlinds() {

        if (this._state.state == 'blinds') {
            return;
        }

        this._state.state = 'blinds';
        this._saveHistory();
        this._state.round = { state: this._state.state, actions: [] };
        console.log('>>>> blinds');

        this._reply(this._ping.channel, 'Blinds...');


        this._nextDealer();
        let p = this._getCurrentDealer();
        this._reply(this._ping.channel, `${p.player} is dealer`);

        this._requestPing(1000);
    }

    _updatePot(mo) {
        this._state.pot += mo;
        this._reply(this._ping.channel, 'pot is at $' + this._state.pot);
    }

    _updateBlinds() {

        this._requestPing(1000);

        // set blinds

        let round = this._state.round;
        if (round.smallBlind === undefined) {
            // next player after dealer
            if (!this._nextPlayer()) {
                // end game?
                return;
            }

            let p = this._getCurrentPlayer();
            this._state.smallBlind = p.seat;
            round.smallBlind = this._state.smallBlind;
            this._reply(this._ping.channel, 'small blind ' + p.player + ' $' + this._state.settings.smallBlind);

            this._updatePot(this._state.settings.smallBlind);
            return;
        }

        if (round.bigBlind === undefined) {
            // next player after small blind
            if (!this._nextPlayer()) {
                // end game?
                return;
            }

            let p = this._getCurrentPlayer();
            this._state.bigBlind = this._getCurrentPlayer().seat;
            round.bigBlind = this._state.bigBlind;
            this._reply(this._ping.channel, 'big blind ' + p.player + ' $' + this._state.settings.bigBlind);

            this._updatePot(this._state.settings.bigBlind);
            return;
        }

        this.setDeal();
    }

    setDeal() {

        if (this._state.state == 'deal') {
            return;
        }

        this._requestPing(1000);

        this._state.state = 'deal';
        this._saveHistory();
        this._state.round = { state: this._state.state, actions: [] };
        console.log('>>>> deal');

        this._reply(this._ping.channel, 'Dealing...');

        // fast cards...
        let deck = FastCards.createEmptyStack();
        deck.pushCards(this._state.deck);

        // community
        let stack = FastCards.createEmptyStack();
        for(let i=0;i<5;i++) {
            stack.pushCard(deck.popCard());
        }

        this._state.community = stack.Cards;
        this._state._community = stack.encode(true);

        for (let p of this._state.table.players) {
            if (p === null) {
                continue; 
            }
            if (p.active) {
                stack.clear();
                let dealCount = 2; // 4 for omaha
                for(let i=0;i<dealCount;i++) {
                    stack.pushCard(deck.popCard());
                }
                p.hole = stack.Cards;
                p._hole = stack.encode(true);

                this._reply(p.player + '@' + this._ping.channel, p.player + ' hole: ' + p._hole);
            }
        }

        // token
        this._state.round.no = 0;
    }

    _updateDeal() {
        this._requestPing(1000);
        this.setBetting();
    }

    setBetting() {
        this._requestPing(1000);
        this._state.state = 'betting';
        this._saveHistory();

        let previousRound = Object.assign({}, this._state.round);
        this._state.round = { state: this._state.state, actions: [] };
        this._state.round.no = (previousRound.no || 0) + 1;
        this._state.round.tag = ['preflop','flop','turn','river','showdown'][this._state.round.no - 1];

        if (this._state.round.tag == 'showdown') {
            this.setShowdown();
            return;
        }

        console.log('>>>> betting');

        this._reply(this._ping.channel, 'Betting...' + this._state.round.tag);

        this._reply(this._ping.channel, this._getCommunity());
        this._getUnderTheGun();

        this._state.round.currentBettor =  this._state.token;
    }

    _getCommunity() {

        if (this._state.round.tag == 'preflop') {
            return '?? ?? ??';
        }

        let community = this._state._community || '';
        let showLimit = 0;

        if (this._state.round.tag == 'flop') {
            showLimit = 3;
        }
        if (this._state.round.tag == 'turn') {
            showLimit = 4;
        }
        if (this._state.round.tag == 'river') {
            showLimit = 5;
        }
        if (this._state.state == 'showdown') {
            showLimit = 5;
        }

        community = community.slice(0,(showLimit*3)-1);
        return community;
    }

    _updateBetting() {

        this._requestPing(1000);

        // check last man standing
        let lastMan;
        let activeCount = 0;
        for (let p of this._state.table.players) {
            if (p === null) {
                continue; 
            }
            if (p.active) {
                lastMan = p;
                activeCount++;
            }
        }

        if (activeCount == 1 && lastMan !== undefined) {
            lastMan.winner = true;
            this.setEnd();
            return;
        }

        // check betting round end
        console.log(this._state.round.tag);
    }

    _getUnderTheGun() {

        if (this._state.round.tag == 'preflop') {
            this._state.token = this._state.dealer; 
            this._nextPlayer(); // small blind
            this._nextPlayer(); // big blind
            this._nextPlayer(); // under the gun
        } else {
            this._state.token = this._state.dealer;
            this._nextPlayer(); // under the gun
        }

        let p = this._getCurrentPlayer();
        this._reply(this._ping.channel, `${p.player} is under the gun`);
    }

    _getTokenPlayer(token) {

        for(let i=0;i<10;i++) {
            let p = this._getCurrentPlayer();
            if (p == null || !p.active) {
                this._nextPlayer();
                continue;
            }
            return p;
        }

        return null;
    }

    _bet(player, cmd) {

        this._requestPing(1000);

        let p = this._getTokenPlayer();
        if (p == null || p.player != player) {
            this._reply(`${this._ping.from}@${this._ping.channel}`, 'wait your turn');
            return [ false, 'wait turn' ];
        }

        if (cmd == 'check' && this._state.round.tag == 'preflop' && p.seat != this._state.bigBlind) {
            // unless he is bb;
            this._reply(`${this._ping.from}@${this._ping.channel}`, 'cannot check on preflop');
            return [ false, 'cannot check on preflop' ];
        }

        if (cmd == 'check' && this._state.round.currentBet != undefined) {
            this._reply(`${this._ping.from}@${this._ping.channel}`, 'cannot check when betting his opened');
            return [ false, 'cannot check on open' ];   
        }

        if (cmd == 'raise') {
            this._state.round.currentBet = 0;
            this._state.round.currentBettor = this._state.token;
        }

        this._reply(this._ping.channel, this._ping.from + ` ${cmd}s`);

        this._nextPlayer();

        if (this._state.round.currentBettor == this._state.token) {
            // next betting round!
            this.setBetting();
        }

        return [ true ];
    }

    _fold(player) {

        this._requestPing(1000);

        let p = this._getTokenPlayer();
        if (p == null || p.player != player) {
            this._reply(`${this._ping.from}@${this._ping.channel}`, 'wait your turn');
            return [ false, 'wait turn' ];
        }

        p.active = false;
        p.fold = true;
        this._reply(this._ping.channel, this._ping.from + ' folds');
        
        this._nextPlayer();
        return [ true ];
    }

    setShowdown() {

        if (this._state.state == 'showdown') {
            return;
        }

        this._requestPing(1000);

        this._state.state = 'showdown';
        this._saveHistory();
        this._state.round = { state: this._state.state, actions: [] };

        console.log('>>>> showdown');

        this._reply(this._ping.channel, 'Showdown...');
        this._reply(this._ping.channel, this._state._community);

        let winner = null;
                        
        for (let p of this._state.table.players) {
            if (p === null) {
                continue; 
            }
            if (!p.active) {
                continue;
            }

            let hand = FastCards.createEmptyStack();
            hand.pushCards(this._state.community);
            hand.pushCards(p.hole);

            let poker = FastEvaluator.evaluate(hand);
            poker.name();

            p.poker = JSON.parse(JSON.stringify(poker));
            p.poker.hand = hand.encode(true);
            delete p.poker.values;

            if (winner === null || winner.poker.handValue < p.poker.handValue) {
                winner = p;
            }

            this._reply(this._ping.channel, p.player + ':' + p._hole + ` (${poker.handName})`);
        }

        if (winner !== null) {
            winner.winner = true;
        }
    }

    _updateShowdown() {
        this._requestPing(1000);
        this.setEnd();
    }

    setEnd() {

        if (this._state.state == 'end') {
            return;
        }

        this._state.state = 'end';
        this._saveHistory();
        this._state.round = { state: this._state.state, actions: [] };
        console.log('>>>> end');

        for (let p of this._state.table.players) {
            if (p === null) {
                continue; 
            }
            if (p.winner) {
                this._reply(this._ping.channel, 'Winner:' + p.player);
                break;
            }
        }

        this._requestPing(1000);
    }

    _updateEnd() {
        this.nextGame();
        this._requestPing(1000);
    }

    nextGame() {

        this._reply(this._ping.channel, 'begin next game');
        // clone...
        this.setWait();
    }

    _nextPlayer() {
        let [ result, token ] = this._nextToken(this._state.token);
        this._state.token = token;
        console.log('player:' + token);
        return result;
    }

    _nextDealer() {
        let [ result, token ] = this._nextToken(this._state.dealer);
        this._state.dealer = token;
        return result;
    }

    _nextToken(token) {

        let idx = token;
        let newToken = idx;
        for(let i=0; i<10; i++) {
            idx = (idx + 1) % 10;
            let p =this._state.table.players[idx];
            if (p != null && p.active) {
                newToken = idx;
                break;
            }
        }

        console.log('nextToken:' + newToken);
        return [ (newToken != token), newToken ];
    }

    _sit(player, seat) {

        console.log(player + '/sit ' + seat);

        if (seat >= this._state.table.players.length) {
            this._reply(`${this._ping.from}@${this._ping.channel}`, 'invalid seat');
            return [ false ];
        }

        if (this._state.table.players[seat] != null) {
            this._reply(`${this._ping.from}@${this._ping.channel}`, 'seat is taken');
            return [ false, 'seat is taken' ];
        }

        this._stand(player); // can't take on two seat
        
        this._state.table.players[seat] = {
            player: player,
            ready: false,
            active: false,
            seat: seat
        };

        this._reply(this._ping.channel, this._ping.from + ' now seated');
        return [ true ];
    }

    _stand(player) {

        console.log(player + '/stand');

        for (let i in this._state.table.players) {
            let p = this._state.table.players[i];
            if (p === null) {
                continue; 
            }
            if (p.player === player) {
                this._state.table.players[i] = null;
                this._reply(this._ping.channel, this._ping.from + ' now standing');
                return [ true ];
            }
        }

        // this._reply(`${this._ping.from}@${this._ping.channel}`, 'player not seated');
        return [ false, 'not seated'];
    }

    _ready(player) {

        for (let p of this._state.table.players) {
            if (p === null) {
                continue; 
            }
            if (p.player === player) {
                p.ready = !p.ready;
                this._reply(this._ping.channel, 
                    this._ping.from +
                    (p.ready ? ' is ' : ' is not ') +
                    'ready');
                return [ true ];
            }
        }

        this._reply(`${this._ping.from}@${this._ping.channel}`, 'player not seated, not ready');
        return [ false, 'player not seated' ];
    }

    set state(s) {

        if (s == undefined || s == null || s.game != 'poker') {
            this.createGame();
            return;
        }

        this._state = s;
    }

    get state() {
        return this._state;
    }

    _getValidActions() {

        switch(this._state.state) {
        case 'waiting':
            return [ 'sit', 'stand', 'ready' ];
        case 'preflop':
        case 'flop':
        case 'betting':
            return [ 'check', 'call', 'raise', 'fold', 'allin' ];
        }
        return [];
    }

    _requestPing(t) {

        // if ([ 'blinds', 'betting' ].indexOf(this._state.state) != -1) {
        //     // only current player can request a ping
        //     let p = this._getCurrentPlayer();
        //     if (p != null && p.player != this._ping.from) {
        //         console.log('ping request denied');
        //         return;
        //     }
        // }

        this._state.ping = t;
    }

    update() {

        console.log('update...' + this._state.state);

        // muddy randomizer

        switch(this._state.state) {
        case 'waiting':
            this._updateWaiting();
            break;    
        case 'deal':
            this._updateDeal();
            break;
        case 'blinds':
            this._updateBlinds();
            break;
        case 'betting':
            this._updateBetting();
            break;
        case 'showdown':
            this._updateShowdown();
            break;
        case 'end':
            this._updateEnd();
            break;

        // ??
        default:
            this.setWait();
            break;
        }
    }

    ping(msg) {

        this._ping = msg;
        this._pong = { messages: [] };
        this._state.ping = 0;

        if (msg.command == undefined) {
            this._saveAction(msg, false);
            return this._pong;
        }

        this.update();

        let cmd = msg.command[1];
        let basicActions = [ 'ping', 'info', 'next' ];
        let validActions = [ ...this._getValidActions(msg), ...basicActions ];

        if (validActions.indexOf(cmd) == -1) {
            console.log('command ignored: ' + cmd + ' > ' + validActions.join(','));
            return this._pong;
        }

        console.log(`--------\n${msg.from}:${cmd}`);

        try {
            let result, info;
            switch(cmd) {
            case 'next':
                this.setBetting();
                break;
            case 'info': {
                this._reply(msg.channel, this.info(true));
                if (this._state.round.no > 1) {
                    let p = this._getPlayerFromName(msg.from);
                    if (p != null) {
                        this._reply(msg.from + '@' + msg.channel,
                            p.player + ' hole: ' + p._hole);
                    }
                }
            }
                break;
            case 'ping':
                msg.internal = true; // disables broadcast or any reply
                return this._pong;
            case 'sit':
                [ result, info ] = this._sit(msg.from, + msg.command[2]);
                break;
            case 'stand':
                [ result, info ] = this._stand(msg.from);
                break;

            case 'check':
            case 'call':
            case 'raise':
                [ result, info ] = this._bet(msg.from, cmd);
                break;

            case 'fold':
                [ result, info ] = this._fold(msg.from, cmd);
                break;

            case 'ready':
                [ result, info ] = this._ready(msg.from);
                this._requestPing(10000);
                break;
            }

            if (result === false) {
                console.log('error: ' + info);
            }

            this._saveAction(msg, result);

        } catch(e) {
            console.log(e);
            delete msg.command;
        }

        return this._pong;
    }

    _reply(to, msg) {
        if (to !== undefined && msg !== undefined) {
            this._pong.messages.push( { from:'poker', to:to, message: msg });
        }
    }

    info(minimal) {

        let p = this._getTokenPlayer();
        let g = Object.assign({}, this._state);
        g.current = p;

        if (minimal) {
            delete g.deck;
            delete g.messages;
            delete g.history;
        }
        // return JSON.stringify(g, null, 2);
        return {
            dealer: g.dealer,
            token: g.token,
            small: g.smallBlind,
            big: g.bigBlind,
            players: (
                g.table.players
                .filter( p => p!=null )
                .map( p => { 
                    return {
                        seat:   p.seat,
                        player: p.player,
                        active: p.active
                    };
                })
            ),
            community: this._getCommunity(),
            state: g.state,
            round: g.round.tag,
            pot: g.pot,
            actions: this._getValidActions()
        };
    }

    dump(minimal) {
        console.log(this.info(minimal));
    }
}

exports.PokerGame = Game;

/*
let g = new Game();
g.createGame();
g.ping({ from:'marvin', message: 'hello world'});
g.ping({ from:'marvin', command:[ 0, 'sit', '0' ]});
g.ping({ from:'mark', command:[ 0, 'sit', '0' ]});
g.ping({ from:'mark', command:[ 0, 'sit', '4' ]});

g.ping( { command: [ 0, 'ping' ]});

g.ping({ from:'marvin', command:[ 0, 'ready']});
g.ping({ from:'mark', command:[ 0, 'ready']});

g.ping( { command: [ 0, 'ping' ]});

g.setShowdown();

g.dump(true);
*/

/*

Table Position in a Ten Player Game

Small Blind – Early Position. Under the Gun after the flop.
Big Blind – Early Position. Has the option of checking on first round before the flop.
Under the Gun – Early Position. Acts first before the flop.
Early – Second person to act before the flop.
Middle – Third person to act before the flop. Middle after the flop.
Middle – Play a few more starting hands if no raises.
Middle/Late – May be considered middle in aggressive game.
Late – Second to last after the flop.
Dealer Button – “On the Button” acts last after the flop.

*/


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var FastCards = __webpack_require__(3).FastCards;
var FastStack = __webpack_require__(0).FastStack;
var FastEvaluator = __webpack_require__(4).FastEvaluator;
var Combinations = __webpack_require__(5).Combinations;

module.exports = {
    FastCards: FastCards,
    FastStack: FastStack,
    FastEvaluator: FastEvaluator,
    Combinations: Combinations
};



/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var FastStack = __webpack_require__(0).FastStack;
var _fsSingleton;

class FastCards
{
    constructor() {
        _fsSingleton = this;

        this.suits = [
            0,0,0,0,0,0,0,0,0,0,0,0,0,
            1,1,1,1,1,1,1,1,1,1,1,1,1,
            2,2,2,2,2,2,2,2,2,2,2,2,2,
            3,3,3,3,3,3,3,3,3,3,3,3,3
        ];

        this.ranks = [
            1,2,3,4,5,6,7,8,9,10,11,12,13,
            1,2,3,4,5,6,7,8,9,10,11,12,13,
            1,2,3,4,5,6,7,8,9,10,11,12,13,
            1,2,3,4,5,6,7,8,9,10,11,12,13
        ];
    }

    createEmptyStack()
    {
        var fs = new FastStack(this);
        return fs;
    }

    createStack(param)
    {
        var fs = new FastStack(this);
        if (param == undefined) {
            return fs;
        }

        if (typeof(param) == 'string') {
            fs.decode(param);
            return fs;
        }

        if (param.length != undefined) {
            fs.pushCards(param);
            return fs;
        }

        if (typeof(param) == 'object') {
            fs.pushCards(param.Cards);
            return fs;
        }
    }
}

if (_fsSingleton == undefined) {
    _fsSingleton = new FastCards();
}
exports.FastCards = _fsSingleton;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var FastStack = __webpack_require__(0).FastStack;
var handTypes = {
    Unknown: -1,
    HighCard: 0,
    Pair: 1,
    TwoPair: 2,
    Trips: 3,
    Straight: 4,
    Flush: 5,
    FullHouse: 6,
    FourOfAKind: 7,
    StraightFlush: 8,
    RoyalFlush: 9
};

var _fsEvaluator;

var straightMasks = [];

class PokerHand {
    constructor() {
        this.reset();
    }

    reset() {
        this.handType = handTypes.Unknown;
        this.handName = '';
        this.handValue = 0;
        this.values = [];
    }

    get Value() {
        return this.handValue;
    }

    get HandType() {
        return this.handType;
    }

    name(t) {
        if (t == undefined) {
            t = this.handType;
        }
        var n = '';
        switch(t) {
        case handTypes.Unknown:   n = 'Unknown'; break;
        case handTypes.HighCard:  n = 'HighCard'; break;
        case handTypes.Pair:      n = 'Pair'; break;
        case handTypes.TwoPair:   n = 'TwoPair'; break;
        case handTypes.Trips:     n = 'Trips'; break;
        case handTypes.Straight:  n = 'Straight'; break;
        case handTypes.Flush:     n = 'Flush'; break;
        case handTypes.FullHouse: n = 'FullHouse'; break;
        case handTypes.FourOfAKind:   n = 'FourOfAKind'; break;
        case handTypes.StraightFlush: n = 'StraightFlush'; break;
        case handTypes.RoyalFlush:    n = 'RoyalFlush'; break;
        }
        this.handName = n;
        return n;
    }
}

class FastEvaluator {
    constructor() {
        straightMasks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < 9; i++) {
            for (var j = 1; j < 6; j++)
                straightMasks[i] |= (0x1 << (j + i));
        }
        straightMasks[9] = (straightMasks[8] & (~0x1 << 9)) | (0x1 << 1);
    }

    calculate([v1, v2, v3, k1, k2, k3]) {
        v1 = v1 || 0;
        v2 = v2 || 0;
        v3 = v3 || 0;
        k1 = k1 || 0;
        k2 = k2 || 0;
        k3 = k3 || 0;
        if (v2 == 1) v2 = 14;
        if (v3 == 1) v3 = 14;
        if (k1 == 1) k1 = 14;
        if (k2 == 1) k2 = 14;
        if (k3 == 1) k3 = 14;
        var val1 = v3 + (((0x1 << 3) + v2) << 4) + (((0x1 << 3) + v1) << 8);
        var val2 = k3 + (((0x1 << 3) + k2) << 4) + (((0x1 << 3) + k1) << 8);
        return (val1 << 16) + val2;
    }

    getValues(offset, mask) {
        var v = [ 0, 0, 0, 0, 0, 0 ];
        var idx = offset;
        var ma = mask & (0x1 << 1);
        if (ma == (0x1 << 1))
            v[idx++] = 14;
        for (var i = 14; i > 0 && idx < 6; i--)
        {
            var m = mask & (0x1 << i);
            if (m == (0x1 << i))
                v[idx++] = i;
        }
        return v;
    }

    evaluate(stack) {

        if (stack.pokerHand == undefined) {
            stack.pokerHand = new PokerHand();
        }
        stack.pokerHand.reset();

        var h = stack.pokerHand;
        var fc = stack.FastCards;
        var rankMask = 0;
        var rankCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var suitCounter = [0, 0, 0, 0];
        var rankSuitedMask = [0, 0, 0, 0];

        var flushSuit = -1;
        var i, j;
        var c, s, r;
        var mask;

        // count ranks & suits
        for (i = 0; i < stack.Count; i++) {
            c = stack.cardAt(i);
            s = fc.suits[c];
            r = fc.ranks[c];
            suitCounter[s]++;
            rankCounter[r]++;

            if (suitCounter[s] >= 5)
                flushSuit = s;

            var rmask = 0x1 << r;
            rankMask |= rmask;
            rankSuitedMask[s] |= rmask;
        }

        // straight flush
        if (flushSuit != -1 && stack.Count >= 5) {
            var straightFlushRank = 0;
            mask = 0;
            for (j = 0; j < 4; j++) {
                for (i = 0; i < 10; i++) {
                    var mm = rankSuitedMask[j] & straightMasks[i];
                    if (mm == straightMasks[i]) {
                        straightFlushRank = i + 5;
                        // mask = mm;
                    }
                }
            }

            if (straightFlushRank != 0) {
                h.handType = handTypes.StraightFlush;
                if (straightFlushRank == 14)
                    h.handType = handTypes.RoyalFlush;
                h.values = [h.handType, straightFlushRank, straightFlushRank - 1, straightFlushRank - 2, straightFlushRank - 3, straightFlushRank - 4];
                h.handValue = this.calculate(h.values);
                h.handSuit = flushSuit;
                return h;
            }
        }

        var fours = 0;
        var trips = 0;
        var trips2 = 0;
        var pair = 0;
        var pair2 = 0;

        // check rank count result
        for (i = 0; i < 13; i++) {
            r = i + 1;
            // fours, trips, pair, twopair
            if (rankCounter[r] == 4 && fours != 1)
                fours = r;
            if (rankCounter[r] == 3) {
                if (trips != 1) {
                    trips2 = trips;
                    trips = r;
                } else {
                    trips2 = r;
                }
            }
            if (rankCounter[r] == 2) {
                if (pair != 1) {
                    pair2 = pair;
                    pair = r;
                } else {
                    pair2 = r;
                }
            }
        }

        // four of a kind
        if (fours != 0) {
            h.handType = handTypes.FourOfAKind;
            h.values = this.getValues(5, rankMask & ~(0x1 << fours));
            h.values[0] = h.handType;
            h.values[1] = fours;
            h.values[2] = fours;
            h.values[3] = fours;
            h.values[4] = fours;
            h.handValue = this.calculate(h.values);
            return h;
        }

        // fullhouse
        if (trips != 0 && pair != 0) {
            h.handType = handTypes.FullHouse;
            h.values = [
                h.handType, trips, trips, trips, pair, pair
            ];
            h.handValue = this.calculate(h.values);
            return h;
        }
        if (trips != 0 && trips2 != 0) {
            h.handType = handTypes.FullHouse;
            h.values = [
                h.handType, trips, trips, trips, trips2, trips2
            ];
            h.handValue = this.calculate(h.values);
            return h;
        }

        // flush
        if (flushSuit != -1) {
            h.handType = handTypes.Flush;
            h.values = this.getValues(1, rankSuitedMask[flushSuit]);
            h.values[0] = h.handType;
            h.handValue = this.calculate(h.values);
            h.handSuit = flushSuit;
            return h;
        }

        // straight
        if (stack.Count >= 5) {
            var straightRank = 0;
            mask = 0;
            for (i = 0; i < 10; i++) {
                mm = rankMask & straightMasks[i];
                if (mm == straightMasks[i]) {
                    straightRank = i + 5;
                    mask = mm;
                }
            }
            if (straightRank != 0) {
                h.handType = handTypes.Straight;
                h.values = [
                    h.handType, 
                    straightRank, 
                    straightRank - 1, 
                    straightRank - 2, 
                    straightRank - 3, 
                    straightRank - 4
                ];
                h.handValue = this.calculate(h.values);
                return h;
            }
        }

        // trips
        if (trips != 0) {
            h.handType = handTypes.Trips;
            h.values = this.getValues(4, (rankMask & ~(0x1 << trips)));
            h.values[0] = h.handType;
            h.values[1] = trips;
            h.values[2] = trips;
            h.values[3] = trips;
            h.handValue = this.calculate(h.values);
            return h;
        }

        // two pair
        if (pair != 0 && pair2 != 0) {
            h.handType = handTypes.TwoPair;
            h.values = this.getValues(5, ((rankMask & ~(0x1 << pair)) & ~(0x1 << pair2)));
            h.values[0] = h.handType;
            h.values[1] = pair;
            h.values[2] = pair;
            h.values[3] = pair2;
            h.values[4] = pair2;
            h.handValue = this.calculate(h.values);
            return h;
        }

        // pair
        if (pair != 0) {
            h.handType = handTypes.Pair;
            h.values = this.getValues(3, rankMask & ~(0x1 << pair));
            h.values[0] = h.handType;
            h.values[1] = pair;
            h.values[2] = pair;
            h.handValue = this.calculate(h.values);
            return h;
        }

        // highcard
        h.handType = handTypes.HighCard;
        h.values = this.getValues(1, rankMask);
        h.values[0] = h.handType;
        h.handValue = this.calculate(h.values);
        return h;
    }
}

if (_fsEvaluator == undefined) {
    _fsEvaluator = new FastEvaluator();
}

exports.FastEvaluator = _fsEvaluator;
exports.PokerHand = PokerHand;
exports.HandTypes = handTypes;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

var _fsCombinations;

class Combinations
{
    _gen(src, length, dest) {
        for(var i in src) {
            var dd = [... dest];
            if (dd.indexOf(i) != -1) {
                continue;
            }
            dd.push(i);
            if (dd.length == length) {
                var com = dd.sort().join(',');
                if (this.combinations.indexOf(com)==-1) {
                    this.combinations.push(com);
                }
                continue;
            }
            this._gen(src, length, dd);
        }
    }

    generate3From5Table() {
        var src = [ 0,1,2,3,4 ];
        this.combinations = [];
        this._gen(src, 3, []);
        this.combination3of5 = this.combinations.map( function(c) {
            return c.split(',');
        });
    }

    generate2From4Table() {
        var src = [ 0,1,2,3 ];
        this.combinations = [];
        this._gen(src, 2, []);
        this.combination2of4 = this.combinations.map( function(c) {
            return c.split(',');
        });
    }

    constructor() {
        this.generate2From4Table();
        this.generate3From5Table();
    }

    getOmahaCombinations(community, hole) {

        // console.log(this.combination3of5);
        // console.log(this.combination2of4);

        var res = [];
        var self = this;
        self.combination3of5.forEach( function(c3) {
            self.combination2of4.forEach( function(c2) {
                //
                var hand = [];
                c3.forEach( function(cc) {
                    hand.push(hole[cc]);
                });
                c2.forEach( function(cc) {
                    hand.push(community[cc]);
                });

                res.push(hand);
            });
        });
        return res;
    }
}

if (_fsCombinations == undefined) {
    _fsCombinations = new Combinations();
}

exports.Combinations = _fsCombinations;

/***/ })
/******/ ]);
});