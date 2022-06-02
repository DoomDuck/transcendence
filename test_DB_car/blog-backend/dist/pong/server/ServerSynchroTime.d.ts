import { Socket } from 'socket.io';
export declare class ServerSynchroTime {
    private socket;
    timeReqSend: number;
    clocksAbsoluteOffset: number;
    halfRoundTripDelay: number;
    connected: boolean;
    constructor(socket: Socket);
    connect(): Promise<void>;
    estimateOffset(): Promise<void>;
}
