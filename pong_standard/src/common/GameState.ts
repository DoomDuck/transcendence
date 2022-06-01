import { Ball } from "./Ball";
import { Bar } from "./Bar";
import { GSettings, PLAYER1, PLAYER2, PlayerID, Direction, LEFT, RIGHT, GameEvent } from "../common"
import { EventEmitter } from "events";

export class GameState extends EventEmitter {
    ball: Ball;
    bars: [Bar, Bar];
    score: [number, number];

    constructor(ball: Ball, bar1: Bar, bar2: Bar) {
        super();
        this.ball = ball;
        this.bars = [bar1, bar2];
        this.score = [0, 0];
    }

    update(elapsed: number) {
        this.ball.update(elapsed);
        this.bars[0].update(elapsed);
        this.bars[1].update(elapsed);
        this.ball.handleCollisions(this.bars);
    }

    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
        this.ball.reset(ballX, ballY, ballSpeedX, ballSpeedY);
        this.ball.speed.set(ballSpeedX, ballSpeedY, 0);
        this.bars[0].reset();
        this.bars[1].reset();
    }
}
