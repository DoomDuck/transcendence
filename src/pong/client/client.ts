import { ClientGame } from './ClientGame';
import { io, Socket } from 'socket.io-client'
import { GameEvent, PlayerID } from '../common/constants';
import { EventEmitter } from 'events';
import { ClientSynchroTime } from './ClientSynchroTime';

export class ClientContext {
    game?: ClientGame;
    socket: Socket;

    constructor() {
        this.socket = io();

        ////
        let synchroTime = new ClientSynchroTime(this.socket);
        synchroTime.connect().then(() => {
            console.log(`SyncroTime connected: ${synchroTime.connected}`);
        });
        ////

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

        document.getElementById("launch-0")?.addEventListener("click", () => this.socket?.emit("playerIdSelect", 0));
        document.getElementById("launch-1")?.addEventListener("click", () => this.socket?.emit("playerIdSelect", 1));
        document.getElementById("launch-2")?.addEventListener("click", () => this.socket?.emit("playerIdSelect", 2));
    }

    startGame(playerId: number) {
        // game
        let game = new ClientGame(playerId);
        this.game = game;
        document.body.appendChild(game.renderer.domElement);
        document.body.appendChild(game.labelRenderer.domElement);

        // // outgoing events
        const transmitEventFromGameToServer = (event: string, eventEmitter: EventEmitter) => {
            eventEmitter.on(event, (...args: any[]) => { this.socket.emit(event, ...args) });
        }
        transmitEventFromGameToServer(GameEvent.SEND_BAR_KEYDOWN, game.state.bars[game.playerId]);
        transmitEventFromGameToServer(GameEvent.SEND_BAR_KEYUP, game.state.bars[game.playerId]);
        transmitEventFromGameToServer(GameEvent.SEND_SET_BALL, game.state);
        transmitEventFromGameToServer(GameEvent.SEND_GOAL, game.state.ball);

        // incomming events
        const transmitEventFromServerToGame = (event: string, eventEmitter: EventEmitter) => {
            this.socket.on(event, (...args: any[]) => { eventEmitter.emit(event, ...args) });
        }
        transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_KEYDOWN, game.state.bars[game.otherPlayerId]);
        transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_KEYUP, game.state.bars[game.otherPlayerId]);
        transmitEventFromServerToGame(GameEvent.RECEIVE_GOAL, game);
        transmitEventFromServerToGame(GameEvent.START, game);
        transmitEventFromServerToGame(GameEvent.RESET, game);
        transmitEventFromServerToGame(GameEvent.PAUSE, game);
        transmitEventFromServerToGame(GameEvent.UNPAUSE, game);
        transmitEventFromServerToGame(GameEvent.RECEIVE_SET_BALL, game.state);

        this.socket.emit("playerReady");

        // Game loop
        function animate() {
            requestAnimationFrame(animate);
            game.frame();
            game.render();
        }
        animate();
    }
}
