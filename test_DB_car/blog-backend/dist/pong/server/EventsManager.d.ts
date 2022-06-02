/// <reference types="node" />
import * as socketio from 'socket.io';
import { Socket } from 'socket.io';
import { EventEmitter } from 'stream';
export declare class EventManager {
    private socketServer;
    transmitEvents: Set<[string, string]>;
    constructor(socketServer: socketio.Server);
    addTransmitEvent(inEvent: string, outEvent: string): void;
    join(socket: Socket): void;
    leave(socket: Socket): void;
    registerCallback(event: string, emitter: EventEmitter, callBack: Function): void;
    disableEvent(event: string): void;
    enableEvent(event: string): void;
}
