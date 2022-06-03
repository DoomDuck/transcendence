import { SocketAddress } from 'net';
import * as socketio from 'socket.io'
import { Socket } from 'socket.io'
import { EventEmitter } from 'stream';

export class EventManager {
    transmitEvents: Array<[string, string]>;
    emittingSocketsRoom: string;
    transmitEventCallbacks: Map<string, (...args: any[]) => void>;
    sockets: Map<string, Socket>;

    constructor (private namespace: socketio.Namespace, public room: string) {
        this.emittingSocketsRoom = room + "_emitters";

    }

    addTransmitEvent(inEvent: string, outEvent: string) {
        this.transmitEvents.push([inEvent, outEvent]);
        this.namespace.in(this.emittingSocketsRoom).allSockets().then((socketIds) => {
            for (let socketId of socketIds) {
                let socket = this.sockets[socketId];
                this.setupTransmitEvent(socket, inEvent, outEvent);
            }
        })
    }

    setupTransmitEvent(emitterSocket: Socket, inEvent: string, outEvent: string) {
        if (this.transmitEventCallbacks.has([emitterSocket.id, inEvent].toString()))
            return;

        let callback = (...args: any[]) => {
            this.namespace.in(this.room).except(emitterSocket.id).emit(outEvent, ...args);
        };
        emitterSocket.on(inEvent, callback);
        this.transmitEventCallbacks.set([emitterSocket.id, inEvent].toString(), callback);
    }

    deleteTransmitEvent(emitterSocket: Socket, inEvent: string) {
        let callback = this.transmitEventCallbacks.get([emitterSocket.id, inEvent].toString())
        if (callback === undefined)
            return;
        emitterSocket.off(inEvent, callback);
        this.transmitEventCallbacks.delete([emitterSocket.id, inEvent].toString())
    }

    join(socket: Socket, canEmmit: boolean) {
        if (this.sockets.has(socket.id))
            return ;
        this.sockets.set(socket.id, socket);

        socket.join(this.room);
        if (canEmmit) {
            socket.join(this.emittingSocketsRoom);
            for (let [inEvent, outEvent] of this.transmitEvents) {
                this.setupTransmitEvent(socket, inEvent, outEvent);
            }
        }
    }

    leave(socket: Socket) {
        if (!this.sockets.has(socket.id))
            return ;
        this.sockets.delete(socket.id);
    }

    registerCallback(event: string, emitter: EventEmitter, callBack: Function) {

    }

    disableEvent(event: string) {

    }

    enableEvent(event: string) {

    }


}
