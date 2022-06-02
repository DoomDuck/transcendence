/// <reference types="node" />
import { EventEmitter } from "events";
import { GameState } from "./GameState";
export declare abstract class Game extends EventEmitter {
    lastTime: number;
    time: number;
    timeAccumulated: number;
    state: GameState;
    paused: boolean;
    constructor(state: GameState);
    setupEvents(): void;
    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number): void;
    start(): void;
    pause(): void;
    unpause(): void;
    frame(): void;
}
