import { PlayerID } from "../../common/constants";
import { PlayersScore } from "../../common/entities";
import { PlayersScoreDisplay } from "../graphic/PlayersScoreDisplay";

/**
 * The score values part of a game instance on the client side (ClientGame).
 * Adds display capability to PlayersScore.
 */
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
