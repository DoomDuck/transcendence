import { Server } from 'socket.io';
export declare class AlertGateway {
    wss: Server;
    sendToAll(msg: string): void;
}
