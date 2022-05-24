import { Socket } from "socket.io-client"
import { Bar, Ball, LEFT, PLAYER1, PLAYER2, PlayerID, RIGHT } from "../common";
import { GameEvent } from "../common/constants";
import { GameState } from "../common/GameState";
import { ClientGame } from "./ClientGame";

export class GameManager {
    serverSocket: Socket;
    playerId: PlayerID;
    game: ClientGame;

    constructor(serverSocket: Socket, playerId: PlayerID) {
        this.serverSocket = serverSocket;
        this.playerId = playerId;
        this.game = new ClientGame(playerId);
        this.setupSockets();
    }

    setupSockets() {
        this.game.thisBar().on(GameEvent.SET_BAR_POSITION, (y: number) => {
            this.serverSocket.emit(GameEvent.SET_BAR_POSITION, y);
        });
        this.transmitEventFromServerToGame(GameEvent.SET_OTHER_PLAYER_BAR_POSITION);
        this.transmitEventFromServerToGame(GameEvent.GOAL);
        this.transmitEventFromServerToGame(GameEvent.SET_BALL);
        this.transmitEventFromServerToGame(GameEvent.START);
        this.transmitEventFromServerToGame(GameEvent.PAUSE);
        this.transmitEventFromServerToGame(GameEvent.UNPAUSE);
    }

    transmitEventFromServerToGame(event: string) {
        this.serverSocket.on(event, (...args: any[]) => {
            this.game.emit(event, ...args);
            console.log(`transmitting event '${event}' to the Game instance`);
        });
    }
}
