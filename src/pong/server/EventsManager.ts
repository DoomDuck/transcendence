import * as socketio from 'socket.io'
import { Socket } from 'socket.io'
import { EventEmitter } from 'stream';

export class EventManager {
    transmitEvents: Set<[string, string]>;

    constructor (private socketServer: socketio.Server) {}

    addTransmitEvent(inEvent: string, outEvent: string) {

    }

    join(socket: Socket) {
        socket.join("")
    }

    leave(socket: Socket) {

    }

    registerCallback(event: string, emitter: EventEmitter, callBack: Function) {

    }

    disableEvent(event: string) {

    }

    enableEvent(event: string) {

    }


}
