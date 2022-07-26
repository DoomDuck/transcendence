"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameState = void 0;
class GameState {
    constructor(ball, bar1, bar2, playersScore) {
        this.ball = ball;
        this.bars = [bar1, bar2];
        this.playersScore = playersScore;
    }
    reset(ballX, ballY, ballSpeedX, ballSpeedY) {
        this.ball.reset(ballX, ballY, ballSpeedX, ballSpeedY);
        this.bars[0].reset();
        this.bars[1].reset();
    }
    update(elapsed) {
        this.bars[0].update(elapsed);
        this.bars[1].update(elapsed);
        this.ball.update(elapsed, this.bars);
    }
}
exports.GameState = GameState;
//# sourceMappingURL=GameState.js.map