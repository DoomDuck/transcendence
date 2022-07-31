"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const game_1 = require("./game");
const constants_1 = require("../../pong/common/constants");
const utils_1 = require("../common/utils");
class GameManager {
    constructor(players) {
        this.players = players;
        this.ready = [false, false];
        this.game = new game_1.ServerGame();
        this.setupBarEvent(constants_1.PLAYER1, constants_1.GameEvent.SEND_BAR_KEYUP, constants_1.GameEvent.RECEIVE_BAR_KEYUP);
        this.setupBarEvent(constants_1.PLAYER2, constants_1.GameEvent.SEND_BAR_KEYUP, constants_1.GameEvent.RECEIVE_BAR_KEYUP);
        this.setupBarEvent(constants_1.PLAYER1, constants_1.GameEvent.SEND_BAR_KEYDOWN, constants_1.GameEvent.RECEIVE_BAR_KEYDOWN);
        this.setupBarEvent(constants_1.PLAYER2, constants_1.GameEvent.SEND_BAR_KEYDOWN, constants_1.GameEvent.RECEIVE_BAR_KEYDOWN);
        this.game.onOut(constants_1.GameEvent.GOAL, (playerId) => this.handleGoal(playerId));
        this.game.onOut(constants_1.GameEvent.SEND_SET_BALL, (...args) => this.broadcastEvent(constants_1.GameEvent.RECEIVE_SET_BALL, ...args));
    }
    isReady(playerId) {
        this.ready[playerId] = true;
        if (this.ready[0] && this.ready[1]) {
            console.log("both players are ready, starting");
            this.reset(0, 0, constants_1.LEFT);
            this.start();
        }
    }
    broadcastEvent(event, ...args) {
        this.players[constants_1.PLAYER1].emit(event, ...args);
        this.players[constants_1.PLAYER2].emit(event, ...args);
    }
    setupBarEvent(emitter, sendEvent, receiveEvent) {
        let receiver = emitter == constants_1.PLAYER1 ? constants_1.PLAYER2 : constants_1.PLAYER1;
        this.players[emitter].on(sendEvent, (...args) => {
            this.players[receiver].emit(receiveEvent, ...args);
            this.game.emitIn(receiveEvent, emitter, ...args);
        });
    }
    start() {
        this.game.emitIn(constants_1.GameEvent.START);
        this.players[0].emit(constants_1.GameEvent.START);
        this.players[1].emit(constants_1.GameEvent.START);
    }
    reset(ballX, ballY, ballDirection) {
        let ballSpeedX = ballDirection * constants_1.GSettings.BALL_INITIAL_SPEEDX;
        let ballSpeedY = ((2 * Math.random() - 1) * constants_1.GSettings.BALL_SPEEDY_MAX) / 3;
        this.game.emitIn(constants_1.GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
        this.players[0].emit(constants_1.GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
        this.players[1].emit(constants_1.GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
    }
    handleGoal(playerId) {
        console.log("GOAL !!!");
        this.broadcastEvent(constants_1.GameEvent.GOAL, playerId);
        let ballDirection = playerId == constants_1.PLAYER1 ? constants_1.LEFT : constants_1.RIGHT;
        (0, utils_1.delay)(500)
            .then(() => this.reset(0, 0, ballDirection))
            .then(() => (0, utils_1.delay)(500))
            .then(() => this.start());
    }
}
exports.GameManager = GameManager;
//# sourceMappingURL=GameManager.js.map