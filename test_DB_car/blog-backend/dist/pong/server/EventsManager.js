"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventManager = void 0;
class EventManager {
    constructor(socketServer) {
        this.socketServer = socketServer;
    }
    addTransmitEvent(inEvent, outEvent) {
    }
    join(socket) {
        socket.join("");
    }
    leave(socket) {
    }
    registerCallback(event, emitter, callBack) {
    }
    disableEvent(event) {
    }
    enableEvent(event) {
    }
}
exports.EventManager = EventManager;
//# sourceMappingURL=EventsManager.js.map