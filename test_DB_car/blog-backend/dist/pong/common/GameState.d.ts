/// <reference types="node" />
import { Ball } from "./Ball";
import { Bar } from "./Bar";
import { EventEmitter } from "events";
export declare class GameState extends EventEmitter {
    ball: Ball;
    bars: [Bar, Bar];
    score: [number, number];
    constructor(ball: Ball, bar1: Bar, bar2: Bar);
    update(elapsed: number): void;
    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number): void;
}
