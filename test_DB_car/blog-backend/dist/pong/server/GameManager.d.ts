/// <reference types="node" />
import { Socket } from "socket.io";
import { PlayerID } from "../common";
import { Direction } from "../common/constants";
import { ServerGame } from "./ServerGame";
import * as socketio from 'socket.io';
import { EventEmitter } from "events";
declare type GameSockets = {
    players: [Socket, Socket];
    playersReady: [boolean, boolean];
    playersSetBallCallbacks: [(...args: any[]) => void, (...args: any[]) => void];
    observers: Socket[];
};
export declare class GameManager extends EventEmitter {
    socketServer: socketio.Server;
    sockets: GameSockets;
    game: ServerGame;
    constructor(socketServer: socketio.Server);
    onConnection(socket: Socket): void;
    onDisconnect(socket: Socket): void;
    synchroTimeWithClient(socket: Socket): void;
    setupSockets(): void;
    resetSockets(): void;
    setupSetBallEvents(): void;
    resetSetBallEvents(): void;
    broadcastEvent(event: string, ...args: any[]): void;
    transmitEvent(receiver: PlayerID, event: string, ...args: any[]): void;
    setupSendReceiveEvent(emitter: PlayerID, sendEvent: string, receiveEvent: any, thisGameEventEmitter: EventEmitter): (...args: any[]) => void;
    setupSendReceiveEventBroadcast(emitter: PlayerID, sendEvent: string, receiveEvent: any, thisGameEventEmitter: EventEmitter): (...args: any[]) => void;
    handlePlayerDisconnect(playerId: PlayerID, reason?: string): void;
    start(): void;
    reset(ballX: number, ballY: number, ballDirection: Direction): void;
    handleGoal(playerId: PlayerID): void;
    otherPlayer(playerId: PlayerID): PlayerID;
    addObserver(socket: Socket): void;
}
export {};
