import { ElapsedTimeMeasurer } from "../common/game/ElapsedTimeMeasurer";
import { ClientGameManager } from "./game";

/**
 * Root of the client code execution
 * Online version:
 *  - Connect to the server's socket namespace upon creation
 *  - Waits for server to confirm a game starts
 *  - Only then can know its role (p1, p2 or observer)
 * Offline version:
 *  - Start immediately
 *  - Spawns the gravitons and protals
 */
export interface ClientGameContext {
  gameManager: ClientGameManager;
  onFinish(): void;

  animate(): void;
  startGame(): void;
}
