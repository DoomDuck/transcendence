import { PlayerID } from "../constants";
import { GameState } from "../entities/GameState";
export declare abstract class Game {
    lastTime: number;
    timeAccumulated: number;
    state: GameState;
    paused: boolean;
    incommingEventsCallback: Map<string, any>;
    outgoingEventsBallback: Map<string, any>;
    constructor(state: GameState);
    onIn(event: string, callback: any): void;
    onOut(event: string, callback: any): void;
    emitOut(event: string, ...args: any[]): void;
    emitIn(event: string, ...args: any[]): void;
    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number): void;
    start(): void;
    pause(): void;
    unpause(): void;
    goal(playerId: PlayerID): void;
    frame(): void;
    update(elapsed: number): void;
}
