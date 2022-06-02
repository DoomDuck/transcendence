"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientSynchroTime = void 0;
class ClientSynchroTime {
    constructor(socket) {
        this.socket = socket;
        this.connected = false;
        this.flightOffset = 0;
        this.socket.on("timeRequest", () => {
            let timeReqReceive = Date.now();
            this.socket.emit("timeResponse", timeReqReceive, Date.now());
        });
        this.socket.on("setOffsetData", (clocksAbsoluteOffset, halfRoundTripDelay) => {
            this.flightOffset = clocksAbsoluteOffset + halfRoundTripDelay;
        });
    }
    async connect() {
        console.log("begin SynchroTime connection");
        await new Promise(resolve => {
            this.socket.once("syncroTimeConnectionServer", () => {
                console.log("received syncroTimeConnectionServer");
                this.socket.emit("syncroTimeConnectionClient");
            });
            this.socket.once("syncroTimeConnectionServerConfirm", () => {
                this.connected = true;
                resolve(undefined);
            });
        });
    }
}
exports.ClientSynchroTime = ClientSynchroTime;
//# sourceMappingURL=ClientSynchroTime.js.map