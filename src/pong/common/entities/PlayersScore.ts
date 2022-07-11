import { PlayerID } from "../constants";

/**
 * A part of the Game's state.
 * Holds the value of the score for each player.
 * Score for each player in the game.
 * Used directly in the server and extended in client (ClientPlayersScore).
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
