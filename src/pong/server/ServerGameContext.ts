import { ServerGameManager } from './game'
import { PLAYER1, PLAYER2, GameEvent, LEFT, RIGHT, Direction, GSettings } from '../common/constants';
import { Socket } from 'socket.io';
import { delay } from '../common/utils';
import { BarInputEvent, Game } from '../common/game';
import { EventEmitter } from 'stream';
import { BarInputEventStruct, DataChangerEvent, GameProducedEvent } from '../common/game/events';

/**
 * Manage a full game session between two players (sockets) in the server
 * Centralize event management by broadcast and transmission
 */
export class ServerGameContext {
    private game: Game;
    private ready: [boolean, boolean] = [false, false];
    score: [number, number] = [0, 0];

    constructor(private players: [Socket, Socket]) {
        this.game = new Game();
        for (let [emitter, receiver] of [[PLAYER1, PLAYER2], [PLAYER2, PLAYER1]]) {
            this.players[emitter].on(GameEvent.SEND_BAR_EVENT, (...args: BarInputEventStruct) => {
                this.players[receiver].emit(GameEvent.RECEIVE_BAR_EVENT, ...args);
                this.game.state.registerEvent(new BarInputEvent(...args));
            });
            
        }
        // setupEventForTransmission<BarInputEvent>(GameEvent.SEND_BAR_EVENT, GameEvent.RECEIVE_BAR_EVENT);
        // setupEventForTransmission: GameEvent.BALL_BAR_COLLISION,
        // setupEventForTransmission: GameEvent.NO_BALL_BAR_COLLISION,

        // ?? GameProducedEvent.registerEvent(/* NO_COLLISION */, this.handleGoal.bind(this));

        // ??? GameProducedEvent.registerEvent(/* MID_FIELD */, this.broadcastEvent.bind(this));

        setInterval(this.game.frame.bind(this), GSettings.GAME_STEP_MS);
    }

    isReady(playerId: number) {
        this.ready[playerId] = true;
        if (this.ready[0] && this.ready[1]) {
            console.log("both players are ready, starting");
            this.reset(0, 0, LEFT);
            this.start(500);
        }
    }

    broadcastEvent(event: string, ...args: any[]) {
        // console.log(`emitting for broadcast: '${event}' with args '${args}'`);
        this.players[PLAYER1].emit(event, ...args);
        this.players[PLAYER2].emit(event, ...args);
    }

    start(delay: number) {
        const startTime = Date.now() + delay;
        this.game.start(startTime);
        this.players[0].emit(GameEvent.START, startTime);
        this.players[1].emit(GameEvent.START, startTime);
    }

    pause(delay: number) {
        const pauseTime = Date.now() + delay;
        this.game.pause(pauseTime);
        this.players[0].emit(GameEvent.PAUSE, pauseTime);
        this.players[1].emit(GameEvent.PAUSE, pauseTime);
    }

    reset(ballX: number, ballY: number, ballDirection: Direction) {
        let ballSpeedX = ballDirection * GSettings.BALL_INITIAL_SPEEDX;
        let ballSpeedY = (2 * Math.random() - 1) * GSettings.BALL_SPEEDY_MAX / 3;
        // this.game.emit(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
        this.players[0].emit(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
        this.players[1].emit(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
    }

    handleGoal(playerId: number) {
        console.log("GOAL !!!");
        this.broadcastEvent(GameEvent.GOAL, playerId);
        let ballDirection = (playerId == PLAYER1) ? LEFT : RIGHT;
        // the timer is important because it ensures any SEND_SET_BALL event of the previous point
        // doesn't interfere with the next one
        delay(500)
            .then(() => this.reset(0, 0, ballDirection))
            .then(() => this.start(500));
    }
}
