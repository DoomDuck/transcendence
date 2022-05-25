import { EventEmitter } from "events";
import { GameEvent, GSettings } from "."
import { GameState } from "./GameState";
import now from "performance-now"

export abstract class Game extends EventEmitter {
    lastTime: number;
    time: number;
    timeAccumulated: number;
    state: GameState;
    paused: boolean;

    constructor (state: GameState) {
        super();
        this.lastTime = 0;
        this.time = 0;
        this.timeAccumulated = 0;
        this.paused = true;
        this.state = state;
        this.setupEvents();
    }

    setupEvents() {
        this.on(GameEvent.START, () => this.start());
        this.on(GameEvent.PAUSE, () => this.pause());
        this.on(GameEvent.UNPAUSE, () => this.unpause());
    }

    reset(ballSpeedX: number, ballSpeedY: number) {
        this.state.reset(ballSpeedX, ballSpeedY);
        this.lastTime = now();
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
        this.lastTime = now();
    }

    frame() {
        if (this.paused)
            return;
        let newTime = now();
        let dt = newTime - this.lastTime;
        this.timeAccumulated += dt;
        this.lastTime = newTime;

        while (this.timeAccumulated >= GSettings.GAME_STEP) {
            this.time += GSettings.GAME_STEP;
            this.timeAccumulated -= GSettings.GAME_STEP;
            this.state.update(GSettings.GAME_STEP);
            this.emit("update");
        }
        this.emit("frame");
    }
}

