"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerGameState = void 0;
const common_1 = require("../common");
class ServerGameState extends common_1.GameState {
    constructor(ball, bar1, bar2) {
        super(ball, bar1, bar2);
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
        if (Math.abs(this.ball.position.x) <= common_1.GSettings.BALL_CONTROL_FRONTIER_X_SERVER) {
            this.emit(common_1.GameEvent.SEND_SET_BALL, this.ball.position.x, this.ball.position.y, this.ball.speed.x, this.ball.speed.y, Date.now());
        }
    }
}
exports.ServerGameState = ServerGameState;
//# sourceMappingURL=ServerGameState.js.map