import { PlayerID } from '../constants';

/**
 * Simple wrapper around a couple of numbers representing the score.
 * The methods are useful for the score's graphical counterpart in client
 * to be automatically updated (see client/graphic/PlayersScoreDisplay.ts)
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
