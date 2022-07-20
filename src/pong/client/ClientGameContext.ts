import { ClientGameManager } from "./game";

/**
 * Root of the client code execution
 * Connect to the server's socket namespace upon creation
 * Then waits for server to confirm a game starts, and to tell/confirm the role the client has:
 * player 1, player 2 or observer (this is only relevant regarding the control the client will have)
 */
export abstract class ClientGameContext {
  gameManager: ClientGameManager;

  abstract startGame(): void;

  animate(time: DOMHighResTimeStamp) {
    requestAnimationFrame(this.animate.bind(this));
    this.gameManager.game.frame();
    this.gameManager.render(time);
  }
}
