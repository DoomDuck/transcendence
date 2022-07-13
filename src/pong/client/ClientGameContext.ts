import { ClientGameManager } from './game';
import { io, Socket } from 'socket.io-client'
import { GameEvent, GSettings, PlayerID } from '../common/constants';
import { delay } from '../common/utils';
import { SetBallEvent } from '../common/game/events';
import { BallData } from '../common/entities/data';

/**
 * Root of the client code execution
 * Connect to the server's socket namespace upon creation
 * Then waits for server to confirm a game starts, and to tell/confirm the role the client has:
 * player 1, player 2 or observer (this is only relevant regarding the control the client will have)
 */
// If playerId is undefined: offline game, else online
export class ClientGameContext {
    gameManager?: ClientGameManager;
    socket: Socket;

    constructor(public online: boolean) {
        if (this.online) {
            // this.socket = io('http://localhost:5000/pong');

            // this.socket.on("connect", () => {
            //     console.log("connected to server");
            // });
            // this.socket.on("disconnect", ()=> {
            //     this.game?.clearCanvas();
            // });
            // this.socket.on("playerIdConfirmed", (playerId: number, ready: () => void) => {
            //     this.startGame(playerId);
            //     ready();
            // });
        }
        else
            this.startGame();
    }

    startGame(playerId?: PlayerID) {
        // game
        this.gameManager = new ClientGameManager(playerId);
        let game = this.gameManager.game;
        if (!this.online) {
            game.reset(0, 0, GSettings.BALL_INITIAL_SPEEDX, 0);
            game.start();
            let cpt = 0;
            let spawnWidth = GSettings.GAME_WIDTH / 2;
            let spawnHeight = GSettings.GAME_HEIGHT - GSettings.GRAVITON_SIZE;
            setInterval(() => {
                let x = Math.random() * spawnWidth - spawnWidth / 2;
                let y = Math.random() * spawnHeight - spawnHeight / 2;
                game.state.data.addGraviton(game.state.data.nowIndex, cpt++, x, y);
            }, 3000);
        }

        // // // outgoing events
        // const transmitEventFromGameToServer = (event: string) => {
        //     game.onOut(event, (...args: any[]) => { this.socket.emit(event, ...args) });
        // }
        // transmitEventFromGameToServer(GameEvent.SEND_BAR_KEYDOWN);
        // transmitEventFromGameToServer(GameEvent.SEND_BAR_KEYUP);

        // // incomming events
        // const transmitEventFromServerToGame = (event: string) => {
        //     this.socket.on(event, (...args: any[]) => { game.emitIn(event, ...args) });
        // }
        // transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_KEYDOWN);
        // transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_KEYUP);
        // transmitEventFromServerToGame(GameEvent.RECEIVE_SET_BALL);
        // transmitEventFromServerToGame(GameEvent.GOAL);
        // transmitEventFromServerToGame(GameEvent.START);
        // transmitEventFromServerToGame(GameEvent.RESET);
        // transmitEventFromServerToGame(GameEvent.PAUSE);
        // transmitEventFromServerToGame(GameEvent.UNPAUSE);

        // Game loop
        let animate = (time: DOMHighResTimeStamp) => {
            requestAnimationFrame(animate);
            game.frame();
            this.gameManager?.render(time);
        }
        animate(Date.now());
    }
}