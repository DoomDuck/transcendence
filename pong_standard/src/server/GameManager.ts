import EventEmitter from "events";
import { Socket } from "socket.io"
import { Bar, Ball, LEFT, PLAYER1, PLAYER2, PlayerID, RIGHT } from "../common";
import { GameEvent, Direction, GSettings } from "../common/constants";
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

    constructor (playerSockets: [Socket, Socket]) {
        this.playerSockets = playerSockets;
        this.observerSockets = [];
        this.game = new ServerGame();
        this.setupSockets();
    }

    setupSockets() {
        this.playerSockets[PLAYER1].on("disconnect", (reason?: string) => this.handlePlayerDisconnect(PLAYER1, reason));
        this.playerSockets[PLAYER2].on("disconnect", (reason?: string) => this.handlePlayerDisconnect(PLAYER2, reason));
        this.setupBarSetEventTransmit(PLAYER1);
        this.setupBarSetEventTransmit(PLAYER2);
        this.game.state.ball.on(GameEvent.GOAL, (playerId: PlayerID) => this.handleGoal(playerId));
        this.game.on(GameEvent.SET_BALL, (...args: any[]) => this.broadcastEvent(GameEvent.SET_BALL, ...args));
    }

    start(ballDirection: Direction) {
        this.reset(ballDirection);
        // TODO: wait ready
        this.game.start();
        this.playerSockets[0].emit(GameEvent.START);
        this.playerSockets[1].emit(GameEvent.START);
    }
    
    reset(ballDirection: Direction) {
        let ballSpeedX = ballDirection * GSettings.BALL_INITIAL_SPEEDX;
        let ballSpeedY = (2 * Math.random() - 1) * GSettings.BALL_SPEEDY_MAX / 3;
        this.game.reset(ballSpeedX, ballSpeedY);
        this.playerSockets[0].emit(GameEvent.RESET, ballSpeedX, ballSpeedY);
        this.playerSockets[1].emit(GameEvent.RESET, ballSpeedX, ballSpeedY);
    }

    handleGoal(playerId: PlayerID) {
        let ballDirection = (playerId == PLAYER1) ? LEFT : RIGHT;
        this.start(ballDirection);
        this.broadcastEvent(GameEvent.GOAL, playerId);
        console.log("GOAL !!!")
    }

    addObserver(socket: Socket) {
        this.observerSockets.push(socket);
        socket.on("disconnect", () => removeElementByValue(this.observerSockets, socket));
    }

    otherPlayer(playerId: PlayerID) {
        return (playerId == PLAYER1) ? PLAYER2 : PLAYER1;
    }

    handlePlayerDisconnect(playerId: PlayerID, reason?: string) {
        this.game.pause();
        let receiver = this.otherPlayer(playerId);
        this.transmitEvent(receiver, "otherPlayerDisconnect", reason);
    }

    broadcastEvent(event: string, ...args: any[]) {
        // console.log(`emitting for broadcast: '${event}' with args '${args}'`);
        this.playerSockets[PLAYER1].emit(event, ...args);
        this.playerSockets[PLAYER2].emit(event, ...args);
        for (let observerSocket of this.observerSockets)
            observerSocket.emit(event, ...args);
    }

    transmitEvent(receiver: PlayerID, event: string, ...args: any[]) {
        this.playerSockets[receiver].emit(event, ...args);
        for (let observerSocket of this.observerSockets)
            observerSocket.emit(event, ...args);
    }

    setupEventFromGameForBroadcast(event: string) {
        this.game.on(event, (...args: any[]) => this.broadcastEvent(event, ...args));
    }

    setupBarSetEventTransmit(emitter: PlayerID) {
        let receiver = this.otherPlayer(emitter);
        this.playerSockets[emitter].on(GameEvent.SET_BAR_POSITION, (y: number) => {
            this.transmitEvent(receiver, GameEvent.SET_OTHER_PLAYER_BAR_POSITION, y);
            this.game.state.bars[emitter].position.y = y;
        });
    }
}

