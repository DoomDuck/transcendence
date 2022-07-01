import { ClientGame } from './game';
import { io, Socket } from 'socket.io-client'
import { GameEvent, GSettings } from '../common/constants';
import { delay } from '../common/utils';

/**
 * Root of the client code execution
 * Connect to the server's socket namespace upon creation
 * Then waits for server to confirm a game starts, and to tell/confirm the role the client has:
 * player 1, player 2 or observer (this is only relevant regarding the control the client will have)
 */
export class ClientContext {
    game?: ClientGame;
    socket: Socket;
    gameContainer: HTMLDivElement;
    gameRendererContainer: HTMLDivElement;
    gameLabelRendererContainer: HTMLDivElement;

    constructor() {
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
        this.startGame(0);
    }

    startGame(playerId: number) {
        // game
        let game = new ClientGame(playerId);
        this.game = game;
        /////
        this.game.reset(0, 0, GSettings.BALL_INITIAL_SPEEDX, 0);
        this.game.start();
        // delay(500).then(() => {
        //     this.game?.state.data.addGraviton(this.game?.state.data.nowIndex, 0, 0, 0);
        // })
        let cpt = 0;
        setInterval(() => {
            let x = Math.random() * GSettings.GAME_WIDTH / 2 - GSettings.GAME_WIDTH / 4;
            let y = Math.random() * GSettings.GAME_HEIGHT - GSettings.GAME_HEIGHT / 2;
            this.game?.state.data.addGraviton(this.game?.state.data.nowIndex, cpt++, x, y);
        }, 3000)

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
            this.game?.frame();
            this.game?.render();
            // if (this.game)
            //     this.game.pause();
        }
        animate(Date.now());
    }
}