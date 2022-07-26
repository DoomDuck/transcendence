import { ClientGame } from "./game";
import { Socket } from "socket.io-client";
export declare class ClientContext {
    game?: ClientGame;
    socket: Socket;
    gameContainer: HTMLDivElement;
    gameRendererContainer: HTMLDivElement;
    gameLabelRendererContainer: HTMLDivElement;
    constructor();
    startGame(playerId: number): void;
}
