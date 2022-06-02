import { Ball, Bar, GameState } from "../common";
export declare class ServerGameState extends GameState {
    constructor(ball: Ball, bar1: Bar, bar2: Bar);
    onReceiveSetBall(x: number, y: number, vx: number, vy: number, time: number): void;
    update(elapsed: number): void;
}
