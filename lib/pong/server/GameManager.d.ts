import { PlayerID, Direction } from "../../pong/common/constants";
import { Socket } from "socket.io";
export declare class GameManager {
    private players;
    private game;
    private ready;
    constructor(players: [Socket, Socket]);
    isReady(playerId: number): void;
    broadcastEvent(event: string, ...args: any[]): void;
    setupBarEvent(emitter: PlayerID, sendEvent: string, receiveEvent: string): void;
    start(): void;
    reset(ballX: number, ballY: number, ballDirection: Direction): void;
    handleGoal(playerId: PlayerID): void;
}
