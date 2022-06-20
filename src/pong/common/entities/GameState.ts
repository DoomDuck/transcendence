import { Ball } from "./Ball";
import { Bar } from "./Bar";
import { EventEmitter } from "events";
import { PlayersScore } from "./PlayersScore";

/**
 * Simple wrapper to encapsulate all entities from the exterior (the Game instance).
 */
export class GameState {
    ball: Ball;
    bars: [Bar, Bar];
    playersScore: PlayersScore;

    constructor(ball: Ball, bar1: Bar, bar2: Bar, playersScore: PlayersScore) {
        this.ball = ball;
        this.bars = [bar1, bar2];
        this.playersScore = playersScore;
    }

    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
        this.ball.reset(ballX, ballY, ballSpeedX, ballSpeedY);
        this.bars[0].reset();
        this.bars[1].reset();
    }

    update(elapsed: number) {
        this.ball.update(elapsed);
        this.bars[0].update(elapsed);
        this.bars[1].update(elapsed);
        this.ball.handleCollisions(this.bars);
    }
}
