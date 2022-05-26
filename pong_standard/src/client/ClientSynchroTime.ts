// Source : https://en.wikipedia.org/wiki/Network_Time_Protocol
import now from 'performance-now'
import { Socket } from 'socket.io-client';

export class ClientSynchroTime {

    constructor(private socket: Socket) {
        this.socket.on("timeRequest", (timeReqSend: number) => {
            let timeReqReceive = Date.now();
            this.socket.emit("timeResponse", timeReqReceive, Date.now());
        })
    }

    async connect() {
        console.log("begin SynchroTime connection")
        await new Promise(resolve => {
            this.socket.once("syncroTimeConnectionServer", () => {
                console.log("received syncroTimeConnectionServer");
                this.socket.emit("syncroTimeConnectionClient");
            });
            this.socket.once("syncroTimeConnectionServerConfirm", resolve);
        })
    }
}
