import { ClientGameManager } from './game';
import { io, Socket } from 'socket.io-client'
import { GameEvent, GSettings } from '../common/constants';
import { delay } from '../common/utils';
import { BarInputEvent, SetBallEvent } from '../common/game/events';
import { BallData } from '../common/entities/data';
import { ClientGameManagerOffline, ClientGameManagerOnline } from './game/ClientGameManager';

/**
 * Root of the client code execution
 * Connect to the server's socket namespace upon creation
 * Then waits for server to confirm a game starts, and to tell/confirm the role the client has:
 * player 1, player 2 or observer (this is only relevant regarding the control the client will have)
 */
// If playerId is undefined: offline game, else online
// export class ClientGameContext {

//     startGame(playerId?: number) {
//         // game
//         if (this.online)
//         else
//             this.gameManager = new ClientGameManager();
//         let game = this.gameManager.game;

//         // online
//         if (this.online) {

//         }
//         // offline
//         else {
//             game.reset(0, 0, GSettings.BALL_INITIAL_SPEEDX, 0);
//             game.start();
//             let cpt = 0;
//             let spawnWidth = GSettings.GAME_WIDTH / 2;
//             let spawnHeight = GSettings.GAME_HEIGHT - GSettings.GRAVITON_SIZE;
//             // setInterval(() => {
//             //     let x = Math.random() * spawnWidth - spawnWidth / 2;
//             //     let y = Math.random() * spawnHeight - spawnHeight / 2;
//             //     game.state.data.addGraviton(game.state.data.currentI, cpt++, x, y);
//             // }, 3000);
//         }

//         // // // outgoing events
//         // const transmitEventFromGameToServer = (event: string) => {
//         //     game.on(event, (...args: any[]) => { this.socket.emit(event, ...args) });
//         // }
//         // transmitEventFromGameToServer(GameEvent.SEND_BAR_EVENT);

//         if (this.online) {
//         }

//         // Game loop
//         let animate = (time: DOMHighResTimeStamp) => {
//             requestAnimationFrame(animate);
//             game.frame();
//             this.gameManager?.render(time);
//         }
//         animate(Date.now());
//     }
// }

abstract class ClientGameContext {
    gameManager: ClientGameManager;

    abstract startGame(): void;

    animate(time: DOMHighResTimeStamp) {
        requestAnimationFrame(this.animate.bind(this));
        this.gameManager.game.frame();
        this.gameManager.render(time);
    }
}

export class ClientGameContextOffline extends ClientGameContext {
    constructor() {
        super();
        this.gameManager = new ClientGameManagerOffline();
    }
    startGame() {
        let game = this.gameManager.game;
        game.reset(0, 0, GSettings.BALL_INITIAL_SPEEDX, 0);
        game.start();
        let cpt = 0;
        let spawnWidth = GSettings.GAME_WIDTH / 2;
        let spawnHeight = GSettings.GAME_HEIGHT - GSettings.GRAVITON_SIZE;
        setInterval(() => {
            let x = Math.random() * spawnWidth - spawnWidth / 2;
            let y = Math.random() * spawnHeight - spawnHeight / 2;
            game.state.data.addGraviton(game.state.data.currentIndex, cpt++, x, y);
        }, 3000);
        this.animate(Date.now());
    }
}

export class ClientGameContextOnline extends ClientGameContext {
    socket: Socket;
    constructor() {
        super();
        this.gameManager = new ClientGameManagerOnline();
    }

    connect() {
        this.socket = io('http://localhost:5000/pong');
        this.socket.on("connect", () => {
            console.log("connected to server");
        });
        this.socket.on("disconnect", ()=> {
            console.log("disconnected from server");
        });

        // // incomming events
        let game = this.gameManager.game;
        const transmitEventFromServerToGame = (event: string) => {
            this.socket.on(event, (...args: any[]) => { game.emit(event, ...args); console.log(`From server: ${event}: ${args}`);});
        }
        transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_EVENT);
        transmitEventFromServerToGame(GameEvent.GOAL);
        transmitEventFromServerToGame(GameEvent.START);
        transmitEventFromServerToGame(GameEvent.RESET);
        transmitEventFromServerToGame(GameEvent.PAUSE);

    }

    startGame() {
        this.socket.on("playerIdConfirmed", (playerId: number, ready: () => void) => {
            (this.gameManager as ClientGameManagerOnline).setup(this.socket, playerId);
            this.animate(Date.now());
            ready();
        });
    }
}