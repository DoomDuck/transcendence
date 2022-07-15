import { ClientGameManager } from './game';
import { io, Socket } from 'socket.io-client'
import { GameEvent, GSettings } from '../common/constants';
import { delay } from '../common/utils';
import { BarInputEvent, SetBallEvent } from '../common/game/events';
import { BallData } from '../common/entities/data';

/**
 * Root of the client code execution
 * Connect to the server's socket namespace upon creation
 * Then waits for server to confirm a game starts, and to tell/confirm the role the client has:
 * player 1, player 2 or observer (this is only relevant regarding the control the client will have)
 */
// If playerId is undefined: offline game, else online
export class ClientGameContext {

    startGame(playerId?: number) {
        // game
        if (this.online)
        else
            this.gameManager = new ClientGameManager();
        let game = this.gameManager.game;

        // online
        if (this.online) {

        }
        // offline
        else {
            game.reset(0, 0, GSettings.BALL_INITIAL_SPEEDX, 0);
            game.start();
            let cpt = 0;
            let spawnWidth = GSettings.GAME_WIDTH / 2;
            let spawnHeight = GSettings.GAME_HEIGHT - GSettings.GRAVITON_SIZE;
            // setInterval(() => {
            //     let x = Math.random() * spawnWidth - spawnWidth / 2;
            //     let y = Math.random() * spawnHeight - spawnHeight / 2;
            //     game.state.data.addGraviton(game.state.data.currentI, cpt++, x, y);
            // }, 3000);
        }

        // // // outgoing events
        // const transmitEventFromGameToServer = (event: string) => {
        //     game.on(event, (...args: any[]) => { this.socket.emit(event, ...args) });
        // }
        // transmitEventFromGameToServer(GameEvent.SEND_BAR_EVENT);

        if (this.online) {
        }

        // Game loop
        let animate = (time: DOMHighResTimeStamp) => {
            requestAnimationFrame(animate);
            game.frame();
            this.gameManager?.render(time);
        }
        animate(Date.now());
    }
}

export interface ClientGameContext {
    gameManager?: ClientGameManager;
    startGame(): void;
}
export class ClientGameContextOffline implements ClientGameContext {
    startGame() {

    }
}
export class ClientGameContextOnline implements ClientGameContext {
    constructor(public socket: Socket) {}

    playerId: number;
    setPlayerId(playerId: number) {
        this.playerId = playerId;
    }
    stratGame() {
        this.socket.on("playerIdConfirmed", (playerId: number, ready: () => void) => {
            this.startGame(playerId);
            ready();
        });
    }
    startGame() {

        // // incomming events
        const transmitEventFromServerToGame = (event: string) => {
            this.socket.on(event, (...args: any[]) => { game.emit(event, ...args); console.log(`From server: ${event}: ${args}`);});
        }
        transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_EVENT);
        transmitEventFromServerToGame(GameEvent.GOAL);
        transmitEventFromServerToGame(GameEvent.START);
        transmitEventFromServerToGame(GameEvent.RESET);
        transmitEventFromServerToGame(GameEvent.PAUSE);
        this.gameManager = new ClientGameManager({playerId: playerId!, socket: this.socket});

    }
}