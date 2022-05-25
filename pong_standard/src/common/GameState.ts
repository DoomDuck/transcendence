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
        // this.ball.on(GameEvent.GOAL, (playerId: PlayerID) => this.handleGoal(playerId));
        this.ball.on(GameEvent.GOAL, (playerId: PlayerID) => this.emit(GameEvent.GOAL, playerId));
    }

    update(elapsed: number) {
        this.ball.update(elapsed);
        this.bars[0].update(elapsed);
        this.bars[1].update(elapsed);
        this.ball.handleCollisions(this.bars);
    }

    resetPositions() {
        this.ball.resetPosition();
        this.bars[0].resetPosition();
        this.bars[1].resetPosition();
    }

    reset(ballSpeedX: number, ballSpeedY: number) {
        this.resetPositions();
        this.ball.speed.set(ballSpeedX, ballSpeedY, 0);
    }

}
