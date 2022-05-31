import { Socket } from "socket.io"
import { LEFT, PLAYER1, PLAYER2, PlayerID, RIGHT } from "../common";
import { GameEvent, Direction, GSettings } from "../common/constants";
import { ServerGame } from "./ServerGame";
import { ServerSynchroTime } from "./ServerSynchroTime";
import * as socketio from 'socket.io'
import { EventEmitter } from "events";

function removeElementByValue<T>(array: T[], item: T) {
    let index = array.indexOf(item);
    if (index !== -1)
        array.splice(index, 1);
}

type GameSockets = {
    players: [Socket, Socket],
    observers: Socket[],
};

export class GameManager {
    socketServer: socketio.Server;
    sockets: GameSockets;
    game: ServerGame;

    constructor (socketServer: socketio.Server) {
        this.sockets = {
            players: [null, null],
            observers: [],
        };
        socketServer.on("connection", this.onConnection.bind(this));
    }

    onConnection(socket: Socket) {
        console.log(`client ${socket.id} connected`)
        socket.on("disconnect", () => this.onDisconnect(socket));
        this.synchroTimeWithClient(socket);
        socket.on("playerIdSelect", (playerId: number) => {
            if (playerId < 2 && this.sockets.players[playerId] === null) {
                this.sockets.players[playerId] = socket;
                socket.emit("playerIdConfirmed", playerId);
            }
            else if (playerId < 2 && this.sockets.players[playerId] === socket) {
                socket.emit("playerIdAlreadySelected");
            }
            else if (playerId < 2) {
                socket.emit("playerIdUnavailable");
            }
            else if (playerId == 2) {
                if (this.sockets.observers.includes(socket))
                    socket.emit("playerIdAlreadySelected");
                else {
                    this.sockets.observers.push(socket);
                    socket.emit("playerIdConfirmed", playerId);
                }
            }
            console.log(playerId < 2 ? `player ${playerId + 1} joined` : "an observer joined")
            if (this.sockets.players[PLAYER1] !== null && this.sockets.players[PLAYER2] !== null) {
                this.game = new ServerGame();
                this.setupSockets();
                console.log("both players are present, starting")
                // this.start(0, 0, LEFT);
                this.start(-GSettings.BAR_INITIALX, GSettings.BAR_HEIGHT, LEFT);
            }
        });
    }

    onDisconnect(socket: Socket) {
        console.log(`client ${socket.id} disconnected`);
        for (let i = 0; i < 2; i++) {
            if (socket === this.sockets.players[i]) {
                console.log(`player ${i + 1} has disconnected`);
                this.sockets.players[i] = null;
                this.resetSockets();
                return;
            }
        }
        if (this.sockets.observers.includes(socket)) {
            console.log("an observer has disconnected");
            removeElementByValue(this.sockets.observers, socket);
        }
    }

    synchroTimeWithClient(socket: Socket) {
        let synchroTime = new ServerSynchroTime(socket);
        synchroTime.connect().then(() => {
            console.log(`SyncroTime connected: ${synchroTime.connected}`);
            synchroTime.estimateOffset().then(() => {
                console.log(`theta = ${synchroTime.clocksAbsoluteOffset}`);
                console.log(`delta/2 = ${synchroTime.halfRoundTripDelay}`);
            });
        });
    }

    setupSockets() {
        this.sockets.players[PLAYER1].on("disconnect", (reason?: string) => this.handlePlayerDisconnect(PLAYER1, reason));
        this.sockets.players[PLAYER2].on("disconnect", (reason?: string) => this.handlePlayerDisconnect(PLAYER2, reason));
        this.setupSendReceiveEvent(PLAYER1, GameEvent.SEND_BAR_KEYUP, GameEvent.RECEIVE_BAR_KEYUP, this.game.state.bars[PLAYER1]);
        this.setupSendReceiveEvent(PLAYER2, GameEvent.SEND_BAR_KEYUP, GameEvent.RECEIVE_BAR_KEYUP, this.game.state.bars[PLAYER2]);
        this.setupSendReceiveEvent(PLAYER1, GameEvent.SEND_BAR_KEYDOWN, GameEvent.RECEIVE_BAR_KEYDOWN, this.game.state.bars[PLAYER1]);
        this.setupSendReceiveEvent(PLAYER2, GameEvent.SEND_BAR_KEYDOWN, GameEvent.RECEIVE_BAR_KEYDOWN, this.game.state.bars[PLAYER2]);
        this.setupSendReceiveEvent(PLAYER1, GameEvent.SEND_SET_BALL, GameEvent.RECEIVE_SET_BALL, this.game.state.ball);
        this.setupSendReceiveEvent(PLAYER2, GameEvent.SEND_SET_BALL, GameEvent.RECEIVE_SET_BALL, this.game.state.ball);
        this.game.state.ball.on(GameEvent.GOAL, (playerId: PlayerID) => this.handleGoal(playerId));
        this.game.on(GameEvent.SEND_SET_BALL, (...args: any[]) => this.broadcastEvent(GameEvent.RECEIVE_SET_BALL, ...args));
    }

    resetSockets() {
        this.sockets.players[PLAYER1]?.removeAllListeners();
        this.sockets.players[PLAYER2]?.removeAllListeners();
        for (let observer of this.sockets.observers)
            observer?.removeAllListeners();
        this.game?.removeAllListeners();
        this.game?.state?.ball?.removeAllListeners();
        this.game?.state?.bars[PLAYER1]?.removeAllListeners();
        this.game?.state?.bars[PLAYER2]?.removeAllListeners();
    }

    broadcastEvent(event: string, ...args: any[]) {
        // console.log(`emitting for broadcast: '${event}' with args '${args}'`);
        this.sockets.players[PLAYER1].emit(event, ...args);
        this.sockets.players[PLAYER2].emit(event, ...args);
        for (let observerSocket of this.sockets.observers)
            observerSocket.emit(event, ...args);
    }

    transmitEvent(receiver: PlayerID, event: string, ...args: any[]) {
        this.sockets.players[receiver].emit(event, ...args);
        for (let observerSocket of this.sockets.observers)
            observerSocket.emit(event, ...args);
    }

    setupSendReceiveEvent(emitter: PlayerID, sendEvent: string, receiveEvent, thisGameEventEmitter: EventEmitter) {
        let receiver = this.otherPlayer(emitter);
        this.sockets.players[emitter].on(sendEvent, (...args: any[]) => {
            this.transmitEvent(receiver, receiveEvent, ...args);
            thisGameEventEmitter.emit(receiveEvent, ...args);
        });
    }

    handlePlayerDisconnect(playerId: PlayerID, reason?: string) {
        this.game.pause();
        let receiver = this.otherPlayer(playerId);
        this.transmitEvent(receiver, "otherPlayerDisconnect", reason);
    }


    start(ballX: number, ballY: number, ballDirection: Direction) {
        this.reset(ballX, ballY, ballDirection);
        // TODO: wait ready
        this.game.start();
        this.sockets.players[0].emit(GameEvent.START);
        this.sockets.players[1].emit(GameEvent.START);
    }

    reset(ballX: number, ballY: number, ballDirection: Direction) {
        if (this.game === undefined)
            return;
        let ballSpeedX = ballDirection * GSettings.BALL_INITIAL_SPEEDX;
        let ballSpeedY = (2 * Math.random() - 1) * GSettings.BALL_SPEEDY_MAX / 3;
        // this.game.reset(ballX, ballY, ballSpeedX, ballSpeedY);
        // this.sockets.players[0].emit(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
        // this.sockets.players[1].emit(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
        this.game.reset(ballX, ballY, 0, -1);
        this.sockets.players[0].emit(GameEvent.RESET, ballX, ballY, 0, -1);
        this.sockets.players[1].emit(GameEvent.RESET, ballX, ballY, 0, -1);
    }

    handleGoal(playerId: PlayerID) {
        let ballDirection = (playerId == PLAYER1) ? LEFT : RIGHT;
        this.start(0, 0, ballDirection);
        this.broadcastEvent(GameEvent.GOAL, playerId);
        // console.log("GOAL !!!")
    }

    otherPlayer(playerId: PlayerID): PlayerID {
        return (playerId == PLAYER1) ? PLAYER2 : PLAYER1;
    }

    addObserver(socket: Socket) {
        this.sockets.observers.push(socket);
        socket.on("disconnect", () => removeElementByValue(this.sockets.observers, socket));
    }
}

