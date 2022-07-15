import { GameEvent, GSettings } from "../constants";
import { GameState } from "../entities";
import { delay } from "../utils";
import { BarInputEvent, type BarInputEventStruct, GameProducedEvent } from "./events";

/**
 * Game represents the environment representing an ongoing game between two players.
 * It is meant to be the bridge between the 'unanimated' game state and the outside
 * (i.e. all the communication + game loop and time-related problematics).
 * Instanciated by both client (in ClientGameManager) and server (in ServerGameContext)
 */
export class Game {
    state: GameState = new GameState();
    startTime: number = 0;
    pauseTime: number = 0;
    pauseOffetEarly: number = 0;
    lastTime: number = 0;
    timeAccumulated: number = 0;
    paused: boolean = true;
    score: [number, number] = [0, 0];
    incommingEventsCallback: Map<string, any>;

    constructor () {
        const eventsCallbackPairs: [string, any][] = [
            [GameEvent.START, this.start.bind(this)],
            [GameEvent.PAUSE, this.pause.bind(this)],
            [GameEvent.RESET, this.reset.bind(this)],
            [GameEvent.RECEIVE_BAR_EVENT,
             (...eventArgs: BarInputEventStruct) => {
                console.log(` -> received ${eventArgs[0]}, ${eventArgs[1]}, ${eventArgs[2]}, ${eventArgs[3]}`);
                this.state.registerEvent(new BarInputEvent(...eventArgs));
            }]
        ]
        this.incommingEventsCallback = new Map(eventsCallbackPairs);
    }

    on(event: string, callback: any) {
        this.incommingEventsCallback.set(event, callback);
    }

    emit(event: string, ...args: any[]) {
        this.incommingEventsCallback.get(event)(...args);
    }

    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
        // console.log('Game reset');
        this.timeAccumulated = 0;
        this.paused = true;
        this.state.reset(ballX, ballY, ballSpeedX, ballSpeedY);
    }

    start(startTime?: number) {
        if (startTime === undefined)
            startTime = Date.now();
        // console.log(`Game start at ${startTime}`);
        this.paused = false;
        this.startTime = startTime + this.pauseOffetEarly;
        this.lastTime = this.startTime;
        this.pauseOffetEarly = 0;
    }

    pause(pauseTime?: number) {
        if (pauseTime === undefined)
            pauseTime = Date.now();
        else
            this.pauseOffetEarly = Math.max(Date.now() - pauseTime, 0);
        this.pauseTime = pauseTime;
        // console.log(`Game pause at ${pauseTime}`);
        this.paused = true;
    }

    goal(playerId: number) {
        this.score[playerId]++;
    }

    frame() {
        const now = Date.now();
        if ((this.paused && now >= this.pauseTime) || (!this.paused && Date.now() < this.startTime))
            return;
        const newTime = now;
        const dt = newTime - this.lastTime;
        this.timeAccumulated += dt;
        this.lastTime = newTime;

        while (this.timeAccumulated >= GSettings.GAME_STEP_MS) {
            this.timeAccumulated -= GSettings.GAME_STEP_MS;
            this.state.update();
        }
    }
}

