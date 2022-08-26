import type { FinishCallback } from "../common/utils";
import { ClientGameManager } from "./game";

/**
 * Root of the client code execution
 *
 * Online version as player (ClientGameContextOnlinePlayer):
 *  - Connect to the server's socket namespace upon creation,
 *    currently joining the matchmaking system
 *  - Wait for server to confirm a game starts
 *  - Only then can know its role (p1, p2)
 *  - Receive the Game events from the server
 *
 * Online version as observer (ClientGameContextOnlineObserver):
 *  - Connect to the server's socket namespace upon creation,
 *    currently joining the first game of the current playing games
 *  - Receive a strem of the current state of the game from the server
 *
 * Offline version (ClientGameContextOffline):
 *  - Start immediately
 *  - Spawn the gravitons and protals
 */
export abstract class ClientGameContext {
  gameManager: ClientGameManager = new ClientGameManager();
  animationHandle?: number;
  constructor(public onFinish: FinishCallback) {}

  abstract animate(): void;
  abstract startGame(): void;
  handleEndOfGame() {
    if (this.animationHandle !== undefined)
      cancelAnimationFrame(this.animationHandle);
    this.onFinish(...this.gameManager.game.score);
  }
}
