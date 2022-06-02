"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerSynchroTime = void 0;
class ServerSynchroTime {
    constructor(socket) {
        this.socket = socket;
        this.connected = false;
        this.socket.on("timeResponse", (timeReqReceive, timeRespSend) => {
            let timeRespReceive = Date.now();
            this.clocksAbsoluteOffset = (timeReqReceive - this.timeReqSend) + (timeRespSend - timeRespReceive);
            this.halfRoundTripDelay = ((timeRespReceive - this.timeReqSend) - (timeRespSend - timeReqReceive)) / 2;
            this.socket.emit("setOffsetData", this.clocksAbsoluteOffset, this.halfRoundTripDelay);
        });
    }
    async connect() {
        console.log("begin SynchroTime connection");
        await new Promise(resolve => {
            this.socket.once("syncroTimeConnectionClient", () => {
                this.socket.emit("syncroTimeConnectionServerConfirm");
                resolve({});
            });
            this.socket.emit("syncroTimeConnectionServer");
        });
    }
    async estimateOffset() {
        await new Promise(resolve => {
            this.socket.once("timeResponse", () => {
                this.connected = true;
                resolve(undefined);
            });
            this.timeReqSend = Date.now();
            this.socket.emit("timeRequest");
        });
    }
}
exports.ServerSynchroTime = ServerSynchroTime;
//# sourceMappingURL=ServerSynchroTime.js.map