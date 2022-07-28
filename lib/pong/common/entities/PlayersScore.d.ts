import { PlayerID } from "../constants";
export declare class PlayersScore {
    score: [number, number];
    constructor();
    handleGoal(playerId: PlayerID): void;
    reset(): void;
}
