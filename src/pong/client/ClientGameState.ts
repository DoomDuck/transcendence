import { Ball, Bar, GameEvent, GameState, PlayerID } from "../common";

export class ClientGameState extends GameState {
    playerId: PlayerID;

    constructor(ball: Ball, bar1: Bar, bar2: Bar, playerId: PlayerID) {
        super(ball, bar1, bar2);
        this.playerId = playerId;
    }

    update(elapsed: number) {
        this.bars[this.playerId].update(elapsed);
  }
}
