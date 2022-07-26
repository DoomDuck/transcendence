import { Ball } from "./Ball";
import { Bar } from "./Bar";
import { PlayersScore } from "./PlayersScore";
export declare class GameState {
    ball: Ball;
    bars: [Bar, Bar];
    playersScore: PlayersScore;
    constructor(ball: Ball, bar1: Bar, bar2: Bar, playersScore: PlayersScore);
    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number): void;
    update(elapsed: number): void;
}
