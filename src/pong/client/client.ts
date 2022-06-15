import { ClientGame } from './ClientGame';
import { io, Socket } from 'socket.io-client'
import { GameEvent, PlayerID } from '../common/constants';
import { EventEmitter } from 'events';

export class ClientContext {
    game?: ClientGame;
    socket: Socket;

    constructor() {
        this.socket = io('http://localhost:5000/pong');

        this.socket.on("connect", () => {
            console.log("connected to server");
        });
        this.socket.on("disconnect", ()=> {
            if (this.game !== undefined) {
                document.body.removeChild(this.game.renderer.domElement);
                document.body.removeChild(this.game.labelRenderer.domElement);
                this.game = undefined;
            }
        })
        this.socket.on("playerIdUnavailable", (playerId: number) => {
            alert(`playerId ${playerId} is already taken`)
        });
        this.socket.on("playerIdAlreadySelected", (playerId: number) => {
            // alert(`playerId already selected`)
        });
        this.socket.on("playerIdConfirmed", (playerId: number) => {
            this.startGame(playerId);
        });
    }

    select(playerId: number) {
        this.socket?.emit("playerIdSelect", playerId)
    }

    startGame(playerId: number) {
        // game
        let game = new ClientGame(playerId);
        this.game = game;

        document.body.appendChild(game.renderer.domElement);
        document.body.appendChild(game.labelRenderer.domElement);

        // // outgoing events
        const transmitEventFromGameToServer = (event: string) => {
            game.on(event, (...args: any[]) => { this.socket.emit(event, ...args) });
        }
        transmitEventFromGameToServer(GameEvent.SEND_BAR_KEYDOWN);
        transmitEventFromGameToServer(GameEvent.SEND_BAR_KEYUP);

        // incomming events
        const transmitEventFromServerToGame = (event: string) => {
            this.socket.on(event, (...args: any[]) => { game.emit(event, ...args) });
        }
        transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_KEYDOWN);
        transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_KEYUP);
        transmitEventFromServerToGame(GameEvent.RECEIVE_SET_BALL);
        transmitEventFromServerToGame(GameEvent.GOAL);
        transmitEventFromServerToGame(GameEvent.START);
        transmitEventFromServerToGame(GameEvent.RESET);
        transmitEventFromServerToGame(GameEvent.PAUSE);
        transmitEventFromServerToGame(GameEvent.UNPAUSE);

        this.socket.emit("playerReady");

        // Game loop
        let animate = () => {
            requestAnimationFrame(animate);
            this.game?.frame();
            this.game?.render();
        }
        animate();
    }
}
