import { GameEvent, GSettings } from "../common/constants";
import {
  GameProducedEvent,
  SpawnGravitonEvent,
  SpawnPortalEvent,
} from "../common/game/events";
import { delay, spawnRandomGraviton, spawnRandomPortal } from "../common/utils";
import { ClientGameContext } from "./ClientGameContext";
import { ClientGameManagerOffline } from "./game/ClientGameManagerOffline";

/**
 * Offline version of the game in the client (see ClientGameContext)
 */
export class ClientGameContextOffline extends ClientGameContext {
  intervalHandles: [number, number] = [0, 0];
  constructor() {
    super();
    this.gameManager = new ClientGameManagerOffline();
  }

  startGame() {
    const game = this.gameManager.game;
    game.start();
    window.setTimeout(() => {
      this.intervalHandles[0] = window.setInterval(
        () => spawnRandomGraviton(game),
        GSettings.GRAVITON_LIFESPAN_MS * 0.55
      );
      spawnRandomGraviton(game);
    }, 500);
    window.setTimeout(() => {
      this.intervalHandles[1] = window.setInterval(
        () => spawnRandomPortal(game),
        GSettings.PORTAL_LIFESPAN_MS * 1.1
      );
      spawnRandomPortal(game);
    }, 1000);
  }

  configure() {
    const game = this.gameManager.game;
    GameProducedEvent.registerEvent(
      "ballOut",
      (time: number, playerId: number) => {
        this.handleGoal(playerId);
      }
    );
    game.reset(0, 0, GSettings.BALL_INITIAL_SPEEDX, 0);
    this.animate(Date.now());
  }

  handleGoal(playerId: number) {
    const game = this.gameManager.game;
    const renderer = this.gameManager.renderer;
    game.pause();
    renderer
      .startVictoryAnimationAsync()
      .then(() => {
        const speedX = (playerId == 0 ? -1 : 1) * GSettings.BALL_INITIAL_SPEEDX;
        game.reset(0, 0, speedX, 0);
        window.clearInterval(this.intervalHandles[0]);
        window.clearInterval(this.intervalHandles[1]);
      })
      .then(() => renderer.scorePanels.goalAgainst(playerId))
      .then(() => delay(500))
      .then(() => this.startGame());
  }
}
