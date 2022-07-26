import { ClientGameManager } from "./game";

/**
 * Root of the client code execution
 * Online version:
 *  - Connect to the server's socket namespace upon creation
 *  - Waits for server to confirm a game starts
 *  - Only then can it know its role (p1, p2 or observer)
 * Offline version:
 *  - Start immediately
 *  - Spawns the gravitons and protals regularly
 */
export abstract class ClientGameContext {
  gameManager: ClientGameManager;

  abstract configure(): void;
  abstract startGame(): void;

  animate(time: DOMHighResTimeStamp) {
    requestAnimationFrame(this.animate.bind(this));
    this.gameManager.game.frame();
    this.gameManager.render(time);
  }
}
