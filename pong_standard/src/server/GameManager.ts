import { Socket } from "socket.io"
import { Bar, Ball, LEFT, PLAYER1, PLAYER2, PlayerID, RIGHT } from "../common";
import { GameEvent } from "../common/constants";
import { GameState } from "../common/GameState";
import { ServerGame } from "./ServerGame";

function removeElementByValue<T>(array: T[], item: T) {
    let index = array.indexOf(item);
    if (index !== -1)
        array.splice(index, 1);
}

export class GameManager {
    playerSockets: [Socket, Socket];
    observerSockets: Socket[];
    game: ServerGame;

    constructor (player1Socket: Socket, player2Socket: Socket) {
        this.playerSockets = [player1Socket, player2Socket];
        this.observerSockets = [];
        const gameState = new GameState(
            new Ball(),
            new Bar(LEFT),
            new Bar(RIGHT)
        );
        this.game = new ServerGame(gameState);
        this.setupSockets();
    }

    setupSockets() {
        this.playerSockets[PLAYER1].on("disconnect", (reason?: string) => this.handlePlayerDisconnect(PLAYER1, reason));
        this.playerSockets[PLAYER2].on("disconnect", (reason?: string) => this.handlePlayerDisconnect(PLAYER2, reason));
        this.playerSockets[PLAYER1].on(GameEvent.SET_BAR_POSITION, (y: number) => {
            this.transmitEvent(PLAYER1, GameEvent.SET_OTHER_PLAYER_BAR_POSITION, y);
            this.game.state.bars[PLAYER1].position.y = y;
        });
        this.playerSockets[PLAYER2].on(GameEvent.SET_BAR_POSITION, (y: number) => {
            this.transmitEvent(PLAYER2, GameEvent.SET_OTHER_PLAYER_BAR_POSITION, y);
            this.game.state.bars[PLAYER2].position.y = y;
        });
        this.setupGameEventBroadcast(GameEvent.START);
        this.setupGameEventBroadcast(GameEvent.PAUSE);
        this.setupGameEventBroadcast(GameEvent.UNPAUSE);
        this.setupGameEventBroadcast(GameEvent.SET_BALL);
        this.setupGameEventBroadcast(GameEvent.GOAL);
    }

    addObserver(socket: Socket) {
        this.observerSockets.push(socket);
        socket.on("disconnect", () => removeElementByValue(this.observerSockets, socket));
    }

    handlePlayerDisconnect(playerId: PlayerID, reason?: string) {
        this.game.pause();
        this.transmitEvent(playerId, "otherPlayerDisconnect", reason);
    }

    broadcastEvent(event: string, ...args: any[]) {
        this.playerSockets[PLAYER1].emit(event, ...args);
        this.playerSockets[PLAYER2].emit(event, ...args);
        for (let observerSocket of this.observerSockets)
            observerSocket.emit(event, ...args);
    }

    setupGameEventBroadcast(event: string) {
        this.game.on(event, (...args: any[]) => this.broadcastEvent(event, ...args));
    }

    transmitEvent(emitter: PlayerID, event: string, ...args: any[]) {
        let receiver = (emitter == PLAYER1) ? PLAYER2 : PLAYER1;
        this.playerSockets[receiver].emit(event, ...args);
        for (let observerSocket of this.observerSockets)
            observerSocket.emit(event, ...args);
    }

    handleGoal(playerId: PlayerID) {
        let dir = (playerId == PLAYER1) ? LEFT : RIGHT;
        this.game.state.resetEntities(dir);
        this.broadcastEvent(GameEvent.GOAL, playerId);
    }
}

