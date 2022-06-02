"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const events_1 = require("events");
const _1 = require(".");
class Game extends events_1.EventEmitter {
    constructor(state) {
        super();
        this.lastTime = 0;
        this.time = 0;
        this.timeAccumulated = 0;
        this.paused = true;
        this.state = state;
        this.setupEvents();
    }
    setupEvents() {
        this.on(_1.GameEvent.START, () => this.start());
        this.on(_1.GameEvent.PAUSE, () => this.pause());
        this.on(_1.GameEvent.UNPAUSE, () => this.unpause());
    }
    reset(ballX, ballY, ballSpeedX, ballSpeedY) {
        this.state.reset(ballX, ballY, ballSpeedX, ballSpeedY);
        this.lastTime = Date.now();
        this.time = 0;
        this.timeAccumulated = 0;
        this.paused = true;
    }
    start() {
        this.paused = false;
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
    frame() {
        if (this.paused)
            return;
        let newTime = Date.now();
        let dt = newTime - this.lastTime;
        this.timeAccumulated += dt;
        this.lastTime = newTime;
        while (this.timeAccumulated >= _1.GSettings.GAME_STEP) {
            this.time += _1.GSettings.GAME_STEP;
            this.timeAccumulated -= _1.GSettings.GAME_STEP;
            this.state.update(_1.GSettings.GAME_STEP);
            this.emit("update");
        }
        this.emit("frame");
    }
}
exports.Game = Game;
//# sourceMappingURL=Game.js.map