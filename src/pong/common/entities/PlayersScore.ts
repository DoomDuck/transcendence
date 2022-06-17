import { PlayerID } from '../constants';

/**
 * A part of the Game's state.
 * A couple of numbers representing the score.
 * Used directly in the server, and extended in the client (ClientPlayersScore).
 */
export class PlayersScore {
    score: [number, number];

    constructor() {
        this.score = [0, 0];
    }

    handleGoal(playerId: PlayerID) {
        this.score[playerId]++;
    }

    reset() {
        this.score = [0, 0];
    }
}
