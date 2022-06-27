import { ServerGame } from './game'
import { PLAYER1, PLAYER2, GameEvent, PlayerID, LEFT, RIGHT, Direction, GSettings } from '../../pong/common/constants';
import { Socket } from 'socket.io';
import { delay } from '../common/utils';

/**
 * Manage a full game session between two players (sockets) in the server
 * Centralize event management by broadcast and transmission
 */
export class GameManager {
    private game: ServerGame;
    private ready: [boolean, boolean] = [false, false];
    constructor(private players: [Socket, Socket]) {
        this.game = new ServerGame();
        this.setupBarEvent(PLAYER1, GameEvent.SEND_BAR_KEYUP, GameEvent.RECEIVE_BAR_KEYUP);
        this.setupBarEvent(PLAYER2, GameEvent.SEND_BAR_KEYUP, GameEvent.RECEIVE_BAR_KEYUP);
        this.setupBarEvent(PLAYER1, GameEvent.SEND_BAR_KEYDOWN, GameEvent.RECEIVE_BAR_KEYDOWN);
        this.setupBarEvent(PLAYER2, GameEvent.SEND_BAR_KEYDOWN, GameEvent.RECEIVE_BAR_KEYDOWN);
        this.game.onOut(GameEvent.GOAL, (playerId: PlayerID) => this.handleGoal(playerId));
        this.game.onOut(GameEvent.SEND_SET_BALL, (...args: any[]) => this.broadcastEvent(GameEvent.RECEIVE_SET_BALL, ...args));
    }

    isReady(playerId: number) {
        this.ready[playerId] = true;
        if (this.ready[0] && this.ready[1]) {
            console.log("both players are ready, starting");
            this.reset(0, 0, LEFT);
            this.start();
        }
    }

    broadcastEvent(event: string, ...args: any[]) {
        // console.log(`emitting for broadcast: '${event}' with args '${args}'`);
        this.players[PLAYER1].emit(event, ...args);
        this.players[PLAYER2].emit(event, ...args);
    }


    setupBarEvent(emitter: PlayerID, sendEvent: string, receiveEvent: string) {
        let receiver = (emitter == PLAYER1) ? PLAYER2 : PLAYER1;
        this.players[emitter].on(sendEvent, (...args: any[]) => {
            this.players[receiver].emit(receiveEvent, ...args);
            this.game.emitIn(receiveEvent, emitter, ...args); // the event on the server has 1 additionnal parameter : the playerId of the owner of the bar
        });
    }

    start() {
        this.game.emitIn(GameEvent.START);
        this.players[0].emit(GameEvent.START);
        this.players[1].emit(GameEvent.START);
    }

    reset(ballX: number, ballY: number, ballDirection: Direction) {
        // let ballSpeedX = ballDirection * GSettings.BALL_INITIAL_SPEEDX;
        // let ballSpeedY = (2 * Math.random() - 1) * GSettings.BALL_SPEEDY_MAX / 3;
        let ballSpeedX = 0;
        let ballSpeedY = GSettings.BALL_SPEEDY_MAX;
        this.game.emitIn(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
        this.players[0].emit(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
        this.players[1].emit(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
    }

    handleGoal(playerId: PlayerID) {
        console.log("GOAL !!!");
        this.broadcastEvent(GameEvent.GOAL, playerId);
        let ballDirection = (playerId == PLAYER1) ? LEFT : RIGHT;
        // the timer is important because it ensures any SEND_SET_BALL event of the previous point
        // doesn't interfere with the next one
        delay(500)
            .then(() => this.reset(0, 0, ballDirection))
            .then(() => delay(500))
            .then(() => this.start());
    }
}
