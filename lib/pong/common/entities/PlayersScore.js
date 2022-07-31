"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayersScore = void 0;
class PlayersScore {
    constructor() {
        this.score = [0, 0];
    }
    handleGoal(playerId) {
        this.score[playerId]++;
    }
    reset() {
        this.score = [0, 0];
    }
}
exports.PlayersScore = PlayersScore;
//# sourceMappingURL=PlayersScore.js.map