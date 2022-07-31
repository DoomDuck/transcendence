"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientPlayersScore = void 0;
const entities_1 = require("../../common/entities");
class ClientPlayersScore extends entities_1.PlayersScore {
    constructor(graphicalObject) {
        super();
        this.graphicalObject = graphicalObject;
    }
    handleGoal(playerId) {
        super.handleGoal(playerId);
        this.graphicalObject.handleGoal(playerId);
    }
    reset() {
        super.reset();
        this.graphicalObject.reset();
    }
}
exports.ClientPlayersScore = ClientPlayersScore;
//# sourceMappingURL=ClientPlayersScore.js.map