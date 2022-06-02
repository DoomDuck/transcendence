"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerGame = void 0;
const common_1 = require("../common");
const Game_1 = require("../common/Game");
const common_2 = require("../common");
class ServerGame extends Game_1.Game {
    constructor() {
        const gameState = new common_2.GameState(new common_2.Ball(), new common_2.Bar(common_1.PLAYER1), new common_2.Bar(common_1.PLAYER2));
        super(gameState);
        this.stepsAccumulated = 0;
        setInterval(this.frame.bind(this), common_1.GSettings.GAME_STEP);
    }
}
exports.ServerGame = ServerGame;
//# sourceMappingURL=ServerGame.js.map