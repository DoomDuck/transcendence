import { PlayerID } from "../../common/constants";
import { PlayersScore } from "../../common/entities";
import { PlayersScoreDisplay } from "../graphic/PlayersScoreDisplay";

export class ClientPlayersScore extends PlayersScore {
    graphicalObject: PlayersScoreDisplay;

    constructor(graphicalObject: PlayersScoreDisplay) {
        super();
        this.graphicalObject = graphicalObject;
    }

    handleGoal(playerId: PlayerID): void {
        super.handleGoal(playerId);
        this.graphicalObject.handleGoal(playerId);
    }

    reset() {
        super.reset();
        this.graphicalObject.reset();
    }
}
