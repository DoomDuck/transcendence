// Source : https://en.wikipedia.org/wiki/Network_Time_Protocol
import now from 'performance-now'
import { Socket } from 'socket.io';

export class ServerSynchroTime {
    timeReqSend: number;
    clocksAbsoluteOffset: number;
    halfRoundTripDelay: number;
    connected: boolean;

    constructor(private socket: Socket) {
        this.connected = false;
        this.socket.on("timeResponse", (timeReqReceive: number, timeRespSend: number) => {
            let timeRespReceive = Date.now();
            this.clocksAbsoluteOffset = (timeReqReceive - this.timeReqSend) + (timeRespSend - timeRespReceive);
            this.halfRoundTripDelay = ((timeRespReceive - this.timeReqSend) - (timeRespSend - timeReqReceive)) / 2;
            this.socket.emit("setOffsetData", this.clocksAbsoluteOffset, this.halfRoundTripDelay);
        })
    }

    async connect() {
        console.log("begin SynchroTime connection")
        await new Promise(resolve => {
            this.socket.once("syncroTimeConnectionClient", () => {
                this.socket.emit("syncroTimeConnectionServerConfirm");
                resolve({});
            });
            this.socket.emit("syncroTimeConnectionServer");
        })
    }

    async estimateOffset() {
        await new Promise(resolve => {
            this.socket.once("timeResponse", () => {
                this.connected = true;
                resolve(undefined);
            });
            this.timeReqSend = Date.now();
            this.socket.emit("timeRequest");
        })
    }
}
