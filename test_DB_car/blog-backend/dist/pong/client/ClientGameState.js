"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientGameState = void 0;
const common_1 = require("../common");
class ClientGameState extends common_1.GameState {
    constructor(ball, bar1, bar2, playerId) {
        super(ball, bar1, bar2);
        this.playerId = playerId;
        this.playerDirection = playerId == common_1.PLAYER1 ? -1 : 1;
        this.on(common_1.GameEvent.RECEIVE_SET_BALL, this.onReceiveSetBall.bind(this));
    }
    onReceiveSetBall(x, y, vx, vy, time) {
        let elapsed = Date.now() - time;
        this.ball.position.set(x, y, 0);
        this.ball.speed.set(vx, vy, 0);
        this.ball.updatePosition(elapsed);
    }
    update(elapsed) {
        super.update(elapsed);
        if (this.ball.position.x * this.playerDirection > common_1.GSettings.BALL_CONTROL_FRONTIER_X_CLIENT
            && !this.ball.atMyLimit) {
            this.emit(common_1.GameEvent.SEND_SET_BALL, this.ball.position.x, this.ball.position.y, this.ball.speed.x, this.ball.speed.y, Date.now());
        }
    }
}
exports.ClientGameState = ClientGameState;
//# sourceMappingURL=ClientGameState.js.map