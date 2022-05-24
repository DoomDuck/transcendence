import { EventEmitter } from "events";
import { GameEvent, GSettings } from "."
import { GameState } from "./GameState";

const now = Date.now;

export abstract class Game extends EventEmitter {
    lastTime: number;
    time: number;
    timeAccumulated: number;
    stepsAccumulated: number;
    state: GameState;
    paused: boolean;

    constructor (state: GameState) {
        super();
        this.lastTime = 0;
        this.time = 0;
        this.timeAccumulated = 0;
        this.stepsAccumulated = 0;
        this.paused = false;
        this.state = state;
        this.setupEvents();
    }

    setupEvents() {
        this.on(GameEvent.START, () => this.start());
        this.on(GameEvent.PAUSE, () => this.pause());
        this.on(GameEvent.UNPAUSE, () => this.unpause());
    }

    abstract startGameLoop(): void;
    abstract stopGameLoop(): void;

    start() {
        console.log("start from Game");
        this.lastTime = now();
        this.time = 0;
        this.timeAccumulated = 0;
        this.stepsAccumulated = 0;
        this.startGameLoop();
    }

    pause() {
        if (this.paused)
            return;
        this.paused = true;
        this.stopGameLoop();
    }

    unpause() {
        if (!this.paused)
            return;
        this.paused = false;
        this.lastTime = now();
        this.startGameLoop();
    }

    frame() {
        if (this.paused)
            return;
        let newTime = now();
        let dt = (newTime - this.lastTime) / 1000;
        // if (dt > GAME_MAX_STEP)
        //     dt = this.step;
        this.timeAccumulated += dt;
        this.lastTime = newTime;

        console.log("ho");
        while (this.timeAccumulated >= GSettings.GAME_STEP) {
            console.log("ha");
            this.time += GSettings.GAME_STEP;
            this.timeAccumulated -= GSettings.GAME_STEP;
            this.state.update(GSettings.GAME_STEP);
            this.stepsAccumulated += 1;
            if (this.stepsAccumulated >= GSettings.SERVER_EMIT_INTERVAL) {
                this.emit(GameEvent.SET_BALL,
                    this.state.ball.position.x,
                    this.state.ball.position.y,
                    this.state.ball.speed.x,
                    this.state.ball.speed.y
                );
                this.stepsAccumulated = 0;
            }
        }
    }
}

