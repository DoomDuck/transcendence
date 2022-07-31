"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const constants_1 = require("../constants");
class Game {
    constructor(state) {
        this.lastTime = 0;
        this.timeAccumulated = 0;
        this.paused = true;
        this.state = state;
        const eventsCallbackPairs = [
            [constants_1.GameEvent.START, this.start.bind(this)],
            [constants_1.GameEvent.PAUSE, this.pause.bind(this)],
            [constants_1.GameEvent.UNPAUSE, this.unpause.bind(this)],
            [constants_1.GameEvent.RESET, this.reset.bind(this)],
            [constants_1.GameEvent.GOAL, this.goal.bind(this)],
        ];
        this.incommingEventsCallback = new Map(eventsCallbackPairs);
        this.outgoingEventsBallback = new Map();
    }
    onIn(event, callback) {
        this.incommingEventsCallback.set(event, callback);
    }
    onOut(event, callback) {
        this.outgoingEventsBallback.set(event, callback);
    }
    emitOut(event, ...args) {
        this.outgoingEventsBallback.get(event)(...args);
    }
    emitIn(event, ...args) {
        this.incommingEventsCallback.get(event)(...args);
    }
    reset(ballX, ballY, ballSpeedX, ballSpeedY) {
        console.log("Game reset");
        this.timeAccumulated = 0;
        this.paused = true;
        this.state.reset(ballX, ballY, ballSpeedX, ballSpeedY);
    }
    start() {
        console.log("Game start");
        this.paused = false;
        this.lastTime = Date.now();
    }
    pause() {
        if (this.paused)
            return;
        this.paused = true;
    }
    unpause() {
        if (!this.paused)
            return;
        this.paused = false;
        this.lastTime = Date.now();
    }
    goal(playerId) {
        this.state.playersScore.handleGoal(playerId);
    }
    frame() {
        if (this.paused)
            return;
        let newTime = Date.now();
        let dt = newTime - this.lastTime;
        this.timeAccumulated += dt;
        this.lastTime = newTime;
        while (this.timeAccumulated >= constants_1.GSettings.GAME_STEP) {
            this.timeAccumulated -= constants_1.GSettings.GAME_STEP;
            this.update(constants_1.GSettings.GAME_STEP);
        }
    }
    update(elapsed) {
        this.state.update(elapsed);
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map