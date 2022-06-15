import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { ServerGame } from '../../pong/server'
import { PLAYER1, PLAYER2, GameEvent, PlayerID, LEFT, RIGHT, Direction, GSettings } from '../../pong/common'

function removeElementByValue<T>(array: T[], item: T) {
    let index = array.indexOf(item);
    if (index !== -1)
        array.splice(index, 1);
}

@Injectable()
export class GameManagerService {
    private waitingClients: Socket[] = [];
    private games: GameInstance[] = [];

    add(socket: Socket) {
        this.waitingClients.push(socket);
        this.launchGameIfPossible();
    }

    launchGameIfPossible() {
        if (this.waitingClients.length >= 2) {
            const gameInstance = new GameInstance([this.waitingClients[0], this.waitingClients[1]]);
            this.games.push(gameInstance);
            this.waitingClients[0].emit("playerIdConfirmed", 0, () => {
                gameInstance.isReady(0);
                console.log('player 0 ready');
            });
            this.waitingClients[1].emit("playerIdConfirmed", 1, () => {
                gameInstance.isReady(1);
                console.log('player 1 ready');
            });
            this.waitingClients.splice(0, 2);
        }
    }

    remove(socket: Socket) {
        removeElementByValue(this.waitingClients, socket);
    }

}

function delay(duration: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }


export class GameInstance {
    private game: ServerGame
    private ready: [boolean, boolean] = [false, false];
    constructor (private players: [Socket, Socket]) {
        this.game = new ServerGame();
        this.setupBarEvent(PLAYER1, GameEvent.SEND_BAR_KEYUP, GameEvent.RECEIVE_BAR_KEYUP);
        this.setupBarEvent(PLAYER2, GameEvent.SEND_BAR_KEYUP, GameEvent.RECEIVE_BAR_KEYUP);
        this.setupBarEvent(PLAYER1, GameEvent.SEND_BAR_KEYDOWN, GameEvent.RECEIVE_BAR_KEYDOWN);
        this.setupBarEvent(PLAYER2, GameEvent.SEND_BAR_KEYDOWN, GameEvent.RECEIVE_BAR_KEYDOWN);
        this.game.on(GameEvent.GOAL, (playerId: PlayerID) => this.handleGoal(playerId));
        this.game.on(GameEvent.SEND_SET_BALL, (...args: any[]) => this.broadcastEvent(GameEvent.RECEIVE_SET_BALL, ...args));
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
            this.game.emit(receiveEvent, emitter, ...args); // the event on the server has 1 additionnal parameter : the playerId of the owner of the bar
        });
    }

    start() {
        console.log('start');
        this.game.start();
        this.players[0].emit(GameEvent.START);
        this.players[1].emit(GameEvent.START);
    }

    reset(ballX: number, ballY: number, ballDirection: Direction) {
        if (this.game === undefined)
            return;
        console.log('reset');
        let ballSpeedX = ballDirection * GSettings.BALL_INITIAL_SPEEDX;
        let ballSpeedY = (2 * Math.random() - 1) * GSettings.BALL_SPEEDY_MAX / 3;
        this.game.reset(ballX, ballY, ballSpeedX, ballSpeedY);
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
