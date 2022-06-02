"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const common_1 = require("../common");
const constants_1 = require("../common/constants");
const ServerGame_1 = require("./ServerGame");
const ServerSynchroTime_1 = require("./ServerSynchroTime");
const events_1 = require("events");
function removeElementByValue(array, item) {
    let index = array.indexOf(item);
    if (index !== -1)
        array.splice(index, 1);
}
function delay(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}
class GameManager extends events_1.EventEmitter {
    constructor(socketServer) {
        super();
        this.sockets = {
            players: [null, null],
            playersReady: [false, false],
            playersSetBallCallbacks: [null, null],
            observers: [],
        };
        socketServer.on("connection", this.onConnection.bind(this));
    }
    onConnection(socket) {
        console.log(`client ${socket.id} connected`);
        socket.on("disconnect", () => this.onDisconnect(socket));
        this.synchroTimeWithClient(socket);
        socket.on("playerIdSelect", (playerId) => {
            if (playerId < 2 && this.sockets.players[playerId] === null) {
                this.sockets.players[playerId] = socket;
                socket.emit("playerIdConfirmed", playerId);
            }
            else if (playerId < 2 && this.sockets.players[playerId] === socket) {
                socket.emit("playerIdAlreadySelected");
            }
            else if (playerId < 2) {
                socket.emit("playerIdUnavailable");
            }
            else if (playerId == 2) {
                if (this.sockets.observers.includes(socket))
                    socket.emit("playerIdAlreadySelected");
                else {
                    this.sockets.observers.push(socket);
                    socket.emit("playerIdConfirmed", playerId);
                }
            }
            console.log(playerId < 2 ? `player ${playerId + 1} joined` : "an observer joined");
            if (this.sockets.players[common_1.PLAYER1] !== null && this.sockets.players[common_1.PLAYER2] !== null) {
                this.game = new ServerGame_1.ServerGame();
                this.setupSockets();
                console.log("both players are present");
            }
        });
        socket.on("playerReady", () => {
            for (let i = 0; i < 2; i++) {
                if (socket === this.sockets.players[i]) {
                    console.log(`player ${i + 1} is ready`);
                    this.sockets.playersReady[i] = true;
                }
            }
            if (this.sockets.playersReady[0] && this.sockets.playersReady[1]) {
                console.log("both players are ready, starting");
                this.reset(0, 0, common_1.LEFT);
                this.start();
            }
        });
    }
    onDisconnect(socket) {
        console.log(`client ${socket.id} disconnected`);
        for (let i = 0; i < 2; i++) {
            if (socket === this.sockets.players[i]) {
                console.log(`player ${i + 1} has disconnected`);
                this.sockets.players[i] = null;
                this.sockets.playersReady[i] = false;
                this.resetSockets();
                return;
            }
        }
        if (this.sockets.observers.includes(socket)) {
            console.log("an observer has disconnected");
            removeElementByValue(this.sockets.observers, socket);
        }
    }
    synchroTimeWithClient(socket) {
        let synchroTime = new ServerSynchroTime_1.ServerSynchroTime(socket);
        synchroTime.connect().then(() => {
            console.log(`SyncroTime connected: ${synchroTime.connected}`);
            synchroTime.estimateOffset().then(() => {
                console.log(`theta = ${synchroTime.clocksAbsoluteOffset}`);
                console.log(`delta/2 = ${synchroTime.halfRoundTripDelay}`);
            });
        });
    }
    setupSockets() {
        this.sockets.players[common_1.PLAYER1].on("disconnect", (reason) => this.handlePlayerDisconnect(common_1.PLAYER1, reason));
        this.sockets.players[common_1.PLAYER2].on("disconnect", (reason) => this.handlePlayerDisconnect(common_1.PLAYER2, reason));
        this.setupSendReceiveEvent(common_1.PLAYER1, constants_1.GameEvent.SEND_BAR_KEYUP, constants_1.GameEvent.RECEIVE_BAR_KEYUP, this.game.state.bars[common_1.PLAYER1]);
        this.setupSendReceiveEvent(common_1.PLAYER2, constants_1.GameEvent.SEND_BAR_KEYUP, constants_1.GameEvent.RECEIVE_BAR_KEYUP, this.game.state.bars[common_1.PLAYER2]);
        this.setupSendReceiveEvent(common_1.PLAYER1, constants_1.GameEvent.SEND_BAR_KEYDOWN, constants_1.GameEvent.RECEIVE_BAR_KEYDOWN, this.game.state.bars[common_1.PLAYER1]);
        this.setupSendReceiveEvent(common_1.PLAYER2, constants_1.GameEvent.SEND_BAR_KEYDOWN, constants_1.GameEvent.RECEIVE_BAR_KEYDOWN, this.game.state.bars[common_1.PLAYER2]);
        this.setupSetBallEvents();
        this.setupSendReceiveEventBroadcast(common_1.PLAYER1, constants_1.GameEvent.SEND_GOAL, constants_1.GameEvent.RECEIVE_GOAL, this);
        this.setupSendReceiveEventBroadcast(common_1.PLAYER2, constants_1.GameEvent.SEND_GOAL, constants_1.GameEvent.RECEIVE_GOAL, this);
        this.on(constants_1.GameEvent.RECEIVE_GOAL, (playerId) => this.handleGoal(playerId));
        this.game.on(constants_1.GameEvent.SEND_SET_BALL, (...args) => this.broadcastEvent(constants_1.GameEvent.RECEIVE_SET_BALL, ...args));
    }
    resetSockets() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        (_a = this.sockets.players[common_1.PLAYER1]) === null || _a === void 0 ? void 0 : _a.removeAllListeners();
        (_b = this.sockets.players[common_1.PLAYER2]) === null || _b === void 0 ? void 0 : _b.removeAllListeners();
        this.sockets.playersSetBallCallbacks = [null, null];
        for (let observer of this.sockets.observers)
            observer === null || observer === void 0 ? void 0 : observer.removeAllListeners();
        (_c = this.game) === null || _c === void 0 ? void 0 : _c.removeAllListeners();
        (_f = (_e = (_d = this.game) === null || _d === void 0 ? void 0 : _d.state) === null || _e === void 0 ? void 0 : _e.ball) === null || _f === void 0 ? void 0 : _f.removeAllListeners();
        (_j = (_h = (_g = this.game) === null || _g === void 0 ? void 0 : _g.state) === null || _h === void 0 ? void 0 : _h.bars[common_1.PLAYER1]) === null || _j === void 0 ? void 0 : _j.removeAllListeners();
        (_m = (_l = (_k = this.game) === null || _k === void 0 ? void 0 : _k.state) === null || _l === void 0 ? void 0 : _l.bars[common_1.PLAYER2]) === null || _m === void 0 ? void 0 : _m.removeAllListeners();
    }
    setupSetBallEvents() {
        this.sockets.playersSetBallCallbacks[common_1.PLAYER1] = this.setupSendReceiveEvent(common_1.PLAYER1, constants_1.GameEvent.SEND_SET_BALL, constants_1.GameEvent.RECEIVE_SET_BALL, this.game.state.ball);
        this.sockets.playersSetBallCallbacks[common_1.PLAYER2] = this.setupSendReceiveEvent(common_1.PLAYER2, constants_1.GameEvent.SEND_SET_BALL, constants_1.GameEvent.RECEIVE_SET_BALL, this.game.state.ball);
    }
    resetSetBallEvents() {
        this.sockets.players[common_1.PLAYER1].removeListener(constants_1.GameEvent.SEND_SET_BALL, this.sockets.playersSetBallCallbacks[common_1.PLAYER1]);
        this.sockets.players[common_1.PLAYER2].removeListener(constants_1.GameEvent.SEND_SET_BALL, this.sockets.playersSetBallCallbacks[common_1.PLAYER2]);
        this.sockets.playersSetBallCallbacks = [null, null];
    }
    broadcastEvent(event, ...args) {
        this.sockets.players[common_1.PLAYER1].emit(event, ...args);
        this.sockets.players[common_1.PLAYER2].emit(event, ...args);
        for (let observerSocket of this.sockets.observers)
            observerSocket.emit(event, ...args);
    }
    transmitEvent(receiver, event, ...args) {
        this.sockets.players[receiver].emit(event, ...args);
        for (let observerSocket of this.sockets.observers)
            observerSocket.emit(event, ...args);
    }
    setupSendReceiveEvent(emitter, sendEvent, receiveEvent, thisGameEventEmitter) {
        let receiver = this.otherPlayer(emitter);
        let callback = (...args) => {
            this.transmitEvent(receiver, receiveEvent, ...args);
            thisGameEventEmitter.emit(receiveEvent, ...args);
        };
        this.sockets.players[emitter].on(sendEvent, callback);
        return callback;
    }
    setupSendReceiveEventBroadcast(emitter, sendEvent, receiveEvent, thisGameEventEmitter) {
        let callback = (...args) => {
            this.broadcastEvent(receiveEvent, ...args);
            thisGameEventEmitter.emit(receiveEvent, ...args);
        };
        this.sockets.players[emitter].on(sendEvent, callback);
        return callback;
    }
    handlePlayerDisconnect(playerId, reason) {
        this.game.pause();
        let receiver = this.otherPlayer(playerId);
        this.transmitEvent(receiver, "otherPlayerDisconnect", reason);
    }
    start() {
        this.game.start();
        this.sockets.players[0].emit(constants_1.GameEvent.START);
        this.sockets.players[1].emit(constants_1.GameEvent.START);
    }
    reset(ballX, ballY, ballDirection) {
        if (this.game === undefined)
            return;
        let ballSpeedX = ballDirection * constants_1.GSettings.BALL_INITIAL_SPEEDX;
        let ballSpeedY = (2 * Math.random() - 1) * constants_1.GSettings.BALL_SPEEDY_MAX / 3;
        this.game.reset(ballX, ballY, ballSpeedX, ballSpeedY);
        this.sockets.players[0].emit(constants_1.GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
        this.sockets.players[1].emit(constants_1.GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
    }
    handleGoal(playerId) {
        console.log("GOAL !!!");
        let ballDirection = (playerId == common_1.PLAYER1) ? common_1.LEFT : common_1.RIGHT;
        Promise.resolve()
            .then(() => this.resetSetBallEvents())
            .then(() => delay(500))
            .then(() => this.reset(0, 0, ballDirection))
            .then(() => delay(500))
            .then(() => {
            this.setupSetBallEvents();
            this.start();
        });
    }
    otherPlayer(playerId) {
        return (playerId == common_1.PLAYER1) ? common_1.PLAYER2 : common_1.PLAYER1;
    }
    addObserver(socket) {
        this.sockets.observers.push(socket);
        socket.on("disconnect", () => removeElementByValue(this.sockets.observers, socket));
    }
}
exports.GameManager = GameManager;
//# sourceMappingURL=GameManager.js.map