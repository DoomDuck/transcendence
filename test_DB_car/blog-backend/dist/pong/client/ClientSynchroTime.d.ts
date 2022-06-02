import { Socket } from 'socket.io-client';
export declare class ClientSynchroTime {
    private socket;
    flightOffset: number;
    connected: boolean;
    constructor(socket: Socket);
    connect(): Promise<void>;
}
