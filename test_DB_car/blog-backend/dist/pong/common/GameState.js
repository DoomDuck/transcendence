"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
const events_1 = require("events");
class GameState extends events_1.EventEmitter {
    constructor(ball, bar1, bar2) {
        super();
        this.ball = ball;
        this.bars = [bar1, bar2];
        this.score = [0, 0];
    }
    update(elapsed) {
        this.ball.update(elapsed);
        this.bars[0].update(elapsed);
        this.bars[1].update(elapsed);
        this.ball.handleCollisions(this.bars);
    }
    reset(ballX, ballY, ballSpeedX, ballSpeedY) {
        this.ball.reset(ballX, ballY, ballSpeedX, ballSpeedY);
        this.ball.speed.set(ballSpeedX, ballSpeedY, 0);
        this.bars[0].reset();
        this.bars[1].reset();
    }
}
exports.GameState = GameState;
//# sourceMappingURL=GameState.js.map