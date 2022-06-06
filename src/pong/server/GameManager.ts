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

type VoidCallback = (...args: any[]) => void;

type GameSockets = {
    players: [Socket?, Socket?],
    playersReady: [boolean, boolean],
    playersSetBallCallbacks: [VoidCallback?, VoidCallback?];
    observers: Socket[],
};

function delay(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export class GameManager extends EventEmitter {
    socketServer: socketio.Server;
    sockets: GameSockets;
    game: ServerGame;

    constructor (socketServer: socketio.Server) {
        super()
        this.sockets = {
            players: [undefined, undefined],
            playersReady: [false, false],
            playersSetBallCallbacks: [undefined, undefined],
            observers: [],
        };
        socketServer.on("connection", this.onConnection.bind(this));
    }

    onConnection(socket: Socket) {
        console.log(`client ${socket.id} connected`)
        socket.on("disconnect", () => this.onDisconnect(socket));
        this.synchroTimeWithClient(socket);
        socket.on("playerIdSelect", (playerId: number) => {
            if (playerId < 2 && this.sockets.players[playerId] === undefined) {
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
            if (this.sockets.players[PLAYER1] !== undefined && this.sockets.players[PLAYER2] !== undefined) {
                this.game = new ServerGame();
                this.setupSockets();
                console.log("both players are present");
                // this.start(-GSettings.BAR_INITIALX, GSettings.BAR_HEIGHT, LEFT);
            }
        });
        socket.on("playerReady", () => {
            for (let i = 0; i < 2; i++) {
                if (socket === this.sockets.players[i]) {
                    console.log(`player ${i + 1} is ready`);
                    this.sockets.playersReady[i] = true;
                }
            }
            if (this.sockets.playersReady[0] && this.sockets.playersReady[1]) {
                console.log("both players are ready, starting");
                this.reset(0, 0, LEFT);
                this.start();
            }
        })
    }

    onDisconnect(socket: Socket) {
        console.log(`client ${socket.id} disconnected`);
        for (let i = 0; i < 2; i++) {
            if (socket === this.sockets.players[i]) {
                console.log(`player ${i + 1} has disconnected`);
                this.sockets.players[i] = undefined;
                this.sockets.playersReady[i] = false;
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
        (this.sockets.players[PLAYER1] as Socket).on("disconnect", (reason?: string) => this.handlePlayerDisconnect(PLAYER1, reason));
        (this.sockets.players[PLAYER2] as Socket).on("disconnect", (reason?: string) => this.handlePlayerDisconnect(PLAYER2, reason));
        this.setupSendReceiveEvent(PLAYER1, GameEvent.SEND_BAR_KEYUP, GameEvent.RECEIVE_BAR_KEYUP, this.game.state.bars[PLAYER1]);
        this.setupSendReceiveEvent(PLAYER2, GameEvent.SEND_BAR_KEYUP, GameEvent.RECEIVE_BAR_KEYUP, this.game.state.bars[PLAYER2]);
        this.setupSendReceiveEvent(PLAYER1, GameEvent.SEND_BAR_KEYDOWN, GameEvent.RECEIVE_BAR_KEYDOWN, this.game.state.bars[PLAYER1]);
        this.setupSendReceiveEvent(PLAYER2, GameEvent.SEND_BAR_KEYDOWN, GameEvent.RECEIVE_BAR_KEYDOWN, this.game.state.bars[PLAYER2]);
        this.setupSetBallEvents();
        // this.game.state.ball.on(GameEvent.GOAL, (playerId: PlayerID) => this.handleGoal(playerId));
        this.setupSendReceiveEventBroadcast(PLAYER1, GameEvent.SEND_GOAL, GameEvent.RECEIVE_GOAL, this);
        this.setupSendReceiveEventBroadcast(PLAYER2, GameEvent.SEND_GOAL, GameEvent.RECEIVE_GOAL, this);
        this.on(GameEvent.RECEIVE_GOAL, (playerId: PlayerID) => this.handleGoal(playerId));
        this.game.on(GameEvent.SEND_SET_BALL, (...args: any[]) => this.broadcastEvent(GameEvent.RECEIVE_SET_BALL, ...args));
    }

    resetSockets() {
        this.sockets.players[PLAYER1]?.removeAllListeners();
        this.sockets.players[PLAYER2]?.removeAllListeners();
        this.sockets.playersSetBallCallbacks = [undefined, undefined];
        for (let observer of this.sockets.observers)
            observer?.removeAllListeners();
        this.game?.removeAllListeners();
        this.game?.state?.ball?.removeAllListeners();
        this.game?.state?.bars[PLAYER1]?.removeAllListeners();
        this.game?.state?.bars[PLAYER2]?.removeAllListeners();
    }

    setupSetBallEvents() {
        this.sockets.playersSetBallCallbacks[PLAYER1] = this.setupSendReceiveEvent(PLAYER1, GameEvent.SEND_SET_BALL, GameEvent.RECEIVE_SET_BALL, this.game.state.ball);
        this.sockets.playersSetBallCallbacks[PLAYER2] = this.setupSendReceiveEvent(PLAYER2, GameEvent.SEND_SET_BALL, GameEvent.RECEIVE_SET_BALL, this.game.state.ball);
    }

    resetSetBallEvents() {
        (this.sockets.players[PLAYER1] as Socket).removeListener(GameEvent.SEND_SET_BALL, this.sockets.playersSetBallCallbacks[PLAYER1] as VoidCallback);
        (this.sockets.players[PLAYER2] as Socket).removeListener(GameEvent.SEND_SET_BALL, this.sockets.playersSetBallCallbacks[PLAYER2] as VoidCallback);
        this.sockets.playersSetBallCallbacks = [undefined, undefined];
    }

    broadcastEvent(event: string, ...args: any[]) {
        // console.log(`emitting for broadcast: '${event}' with args '${args}'`);
        (this.sockets.players[PLAYER1] as Socket).emit(event, ...args);
        (this.sockets.players[PLAYER2] as Socket).emit(event, ...args);
        for (let observerSocket of this.sockets.observers)
            observerSocket.emit(event, ...args);
    }

    transmitEvent(receiver: PlayerID, event: string, ...args: any[]) {
        (this.sockets.players[receiver] as Socket).emit(event, ...args);
        for (let observerSocket of this.sockets.observers)
            observerSocket.emit(event, ...args);
    }

    setupSendReceiveEvent(emitter: PlayerID, sendEvent: string, receiveEvent: string, thisGameEventEmitter: EventEmitter)
    : VoidCallback {
        let receiver = this.otherPlayer(emitter);
        let callback = (...args: any[]) => {
            this.transmitEvent(receiver, receiveEvent, ...args);
            thisGameEventEmitter.emit(receiveEvent, ...args);
        };
        (this.sockets.players[emitter] as Socket).on(sendEvent, callback);
        return callback;
    }

    setupSendReceiveEventBroadcast(emitter: PlayerID, sendEvent: string, receiveEvent: string, thisGameEventEmitter: EventEmitter)
    : VoidCallback {
        let callback = (...args: any[]) => {
            this.broadcastEvent(receiveEvent, ...args);
            thisGameEventEmitter.emit(receiveEvent, ...args);
        };
        (this.sockets.players[emitter] as Socket).on(sendEvent, callback);
        return callback;
    }

    handlePlayerDisconnect(playerId: PlayerID, reason?: string) {
        this.game.pause();
        let receiver = this.otherPlayer(playerId);
        this.transmitEvent(receiver, "otherPlayerDisconnect", reason);
    }


    start() {
        this.game.start();
        (this.sockets.players[0] as Socket).emit(GameEvent.START);
        (this.sockets.players[1] as Socket).emit(GameEvent.START);
    }

    reset(ballX: number, ballY: number, ballDirection: Direction) {
        if (this.game === undefined)
            return;
        let ballSpeedX = ballDirection * GSettings.BALL_INITIAL_SPEEDX;
        let ballSpeedY = (2 * Math.random() - 1) * GSettings.BALL_SPEEDY_MAX / 3;
        this.game.reset(ballX, ballY, ballSpeedX, ballSpeedY);
        (this.sockets.players[0] as Socket).emit(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
        (this.sockets.players[1] as Socket).emit(GameEvent.RESET, ballX, ballY, ballSpeedX, ballSpeedY);
        // this.game.reset(ballX, ballY, 0, -1);
        // this.sockets.players[0].emit(GameEvent.RESET, ballX, ballY, 0, -1);
        // this.sockets.players[1].emit(GameEvent.RESET, ballX, ballY, 0, -1);
    }

    handleGoal(playerId: PlayerID) {
        console.log("GOAL !!!");
        let ballDirection = (playerId == PLAYER1) ? LEFT : RIGHT;
        // the timer is important because it ensures any SEND_SET_BALL event of the previous point
        // doesn't interfere with the next one
        Promise.resolve()
            .then(() => this.resetSetBallEvents())
            .then(() => delay(500))
            .then(() => this.reset(0, 0, ballDirection))
            .then(() => delay(500))
            .then(() => {
                this.setupSetBallEvents();
                this.start();
            });
    }

    otherPlayer(playerId: PlayerID): PlayerID {
        return (playerId == PLAYER1) ? PLAYER2 : PLAYER1;
    }

    addObserver(socket: Socket) {
        this.sockets.observers.push(socket);
        socket.on("disconnect", () => removeElementByValue(this.sockets.observers, socket));
    }
}

