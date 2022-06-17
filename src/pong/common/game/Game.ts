import { EventEmitter } from "events";
import { GameEvent, GSettings } from "../constants"
import { PLAYER1, PLAYER2 } from "../constants";
import { GameState } from "../entities/GameState";

/**
 * Game represents the environment representing an ongoing game between two players.
 * It is meant to be the bridge between the 'unanimated' game state and the outside
 * (i.e. all the communication + game loop and time-related problematics).
 * Extended in the server (ServerGame), as well as in the client (ClientGame).
 */
export abstract class Game extends EventEmitter {
    lastTime: number;
    timeAccumulated: number;
    state: GameState;
    paused: boolean;

    constructor (state: GameState) {
        super();
        this.lastTime = 0;
        this.timeAccumulated = 0;
        this.paused = true;
        this.state = state;
        this.setupEvents();
    }

    setupEvents() {
        // incomming (some specific events are implemented in server and client bars)
        this.on(GameEvent.START, this.start.bind(this));
        this.on(GameEvent.PAUSE, this.pause.bind(this));
        this.on(GameEvent.UNPAUSE, this.unpause.bind(this));
        this.on(GameEvent.RESET, this.reset.bind(this));
        this.on(GameEvent.GOAL, this.state.playersScore.handleGoal.bind(this.state.playersScore));

        // outgoing
        this.state.emit = (event: string, ...args: any[]) => this.emit(event, ...args);
        this.state.ball.emit = (event: string, ...args: any[]) => this.emit(event, ...args);
        this.state.bars[PLAYER1].emit = (event: string, ...args: any[]) => this.emit(event, ...args);
        this.state.bars[PLAYER2].emit = (event: string, ...args: any[]) => this.emit(event, ...args);
        ////
    }

    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
        this.timeAccumulated = 0;
        this.paused = true;
        this.state.reset(ballX, ballY, ballSpeedX, ballSpeedY);
    }

    start() {
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

    frame() {
        if (this.paused)
            return;
        let newTime = Date.now();
        let dt = newTime - this.lastTime;
        this.timeAccumulated += dt;
        this.lastTime = newTime;

        while (this.timeAccumulated >= GSettings.GAME_STEP) {
            this.timeAccumulated -= GSettings.GAME_STEP;
            this.update(GSettings.GAME_STEP);
        }
    }

    update(elapsed: number) {
        this.state.update(elapsed);
    }
}

