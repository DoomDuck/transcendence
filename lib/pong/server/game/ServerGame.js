"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerGame = void 0;
const constants_1 = require("../../common/constants");
const game_1 = require("../../common/game");
const entities_1 = require("../../common/entities");
const entities_2 = require("../../common/entities");
class ServerGame extends game_1.Game {
    constructor() {
        const gameState = new entities_1.GameState(new entities_1.Ball(), new entities_1.Bar(constants_1.PLAYER1), new entities_1.Bar(constants_1.PLAYER2), new entities_2.PlayersScore());
        super(gameState);
        this.onIn(constants_1.GameEvent.RECEIVE_BAR_KEYDOWN, (playerId, ...args) => this.state.bars[playerId].onReceiveKeydown(...args));
        this.onIn(constants_1.GameEvent.RECEIVE_BAR_KEYUP, (playerId, ...args) => this.state.bars[playerId].onReceiveKeyup(...args));
        setInterval(this.frame.bind(this), constants_1.GSettings.GAME_STEP);
    }
    emitBallPosition() {
        this.emitOut(constants_1.GameEvent.SEND_SET_BALL, this.state.ball.position.x, this.state.ball.position.y, this.state.ball.speed.x, this.state.ball.speed.y, Date.now());
    }
    testGoal() {
        if (this.state.ball.gotOutOfScreen()) {
            this.emitOut(constants_1.GameEvent.GOAL, this.state.ball.farthestPlayerSide());
        }
    }
    update(elapsed) {
        super.update(elapsed);
        this.emitBallPosition();
        this.testGoal();
    }
}
exports.ServerGame = ServerGame;
//# sourceMappingURL=ServerGame.js.map