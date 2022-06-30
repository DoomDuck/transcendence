import { GameEvent, GSettings, PlayerID } from "../constants";
import { GameState } from "../entities";
import { delay } from "../utils";
import { registerEvent } from "./events";
// import { BallOutEvent } from "./events";


/**
 * Game represents the environment representing an ongoing game between two players.
 * It is meant to be the bridge between the 'unanimated' game state and the outside
 * (i.e. all the communication + game loop and time-related problematics).
 * Extended in the server (ServerGame), as well as in the client (ClientGame).
 */
export abstract class Game {
    state: GameState = new GameState();
    lastTime: number = 0;
    timeAccumulated: number = 0;
    paused: boolean = true;
    score: [number, number] = [0, 0];
    incommingEventsCallback: Map<string, any>;
    outgoingEventsBallback: Map<string, any>;

    constructor () {
        this.state;
        this.lastTime = 0;
        this.timeAccumulated = 0;
        this.paused = true;
        const eventsCallbackPairs: [string, any][] = [
            [GameEvent.START, this.start.bind(this)],
            [GameEvent.PAUSE, this.pause.bind(this)],
            [GameEvent.UNPAUSE, this.unpause.bind(this)],
            [GameEvent.RESET, this.reset.bind(this)],
            [GameEvent.GOAL, this.goal.bind(this)],
        ]
        this.incommingEventsCallback = new Map(eventsCallbackPairs);
        this.outgoingEventsBallback = new Map();
        registerEvent("ballOut", (time: number, playerId: number) => {
            this.pause();
            delay(500)
                .then(() => this.reset(0, 0, (playerId == 0 ? -1: 1) * GSettings.BALL_INITIAL_SPEEDX, 0))
                .then(() => this.start());
        })
    }

    onIn(event: string, callback: any) {
        this.incommingEventsCallback.set(event, callback);
    }

    onOut(event: string, callback: any) {
        this.outgoingEventsBallback.set(event, callback);
    }

    emitOut(event: string, ...args: any[]) {
        this.outgoingEventsBallback.get(event)(...args);
    }

    emitIn(event: string, ...args: any[]) {
        this.incommingEventsCallback.get(event)(...args);
    }

    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
        console.log('Game reset');
        this.timeAccumulated = 0;
        this.paused = true;
        this.state.reset(ballX, ballY, ballSpeedX, ballSpeedY);
    }

    start() {
        console.log('Game start');
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

    goal(playerId: PlayerID) {
        this.score[playerId]++;
    }

    frame() {
        if (this.paused)
            return;
        let newTime = Date.now();
        let dt = newTime - this.lastTime;
        this.timeAccumulated += dt;
        this.lastTime = newTime;

        while (this.timeAccumulated >= GSettings.GAME_STEP_MS) {
            this.timeAccumulated -= GSettings.GAME_STEP_MS;
            this.update();
        }
    }

    update() {
        this.state.update();
    }
}

