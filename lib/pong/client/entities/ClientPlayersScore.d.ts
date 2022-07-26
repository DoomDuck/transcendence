import { PlayerID } from "../../common/constants";
import { PlayersScore } from "../../common/entities";
import { PlayersScoreDisplay } from "../graphic/PlayersScoreDisplay";
export declare class ClientPlayersScore extends PlayersScore {
    graphicalObject: PlayersScoreDisplay;
    constructor(graphicalObject: PlayersScoreDisplay);
    handleGoal(playerId: PlayerID): void;
    reset(): void;
}
