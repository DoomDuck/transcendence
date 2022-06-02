// Source : https://en.wikipedia.org/wiki/Network_Time_Protocol
import now from 'performance-now'
import { Socket } from 'socket.io-client';

export class ClientSynchroTime {
    flightOffset: number;
    connected: boolean;

    constructor(private socket: Socket) {
        this.connected = false;
        this.flightOffset = 0;
        this.socket.on("timeRequest", () => {
            let timeReqReceive = Date.now();
            this.socket.emit("timeResponse", timeReqReceive, Date.now());
        });
        this.socket.on("setOffsetData", (clocksAbsoluteOffset: number, halfRoundTripDelay: number) => {
            this.flightOffset = clocksAbsoluteOffset + halfRoundTripDelay;
        })
    }

    async connect() {
        console.log("begin SynchroTime connection")
        await new Promise(resolve => {
            this.socket.once("syncroTimeConnectionServer", () => {
                console.log("received syncroTimeConnectionServer");
                this.socket.emit("syncroTimeConnectionClient");
            });
            this.socket.once("syncroTimeConnectionServerConfirm", () => {
                this.connected = true;
                resolve(undefined);
            });
        })
    }
}
