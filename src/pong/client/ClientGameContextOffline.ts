import { GameEvent, GSettings } from "../common/constants";
import { Game } from "../common/game";
import {
  GameProducedEvent,
  SpawnGravitonEvent,
  SpawnPortalEvent,
} from "../common/game/events";
import { Spawner } from "../common/game/Spawner";
import {
  delay,
  randomGravitonCoords,
  randomPortalCoords,
} from "../common/utils";
import { ClientGameContext } from "./ClientGameContext";
import { setupKeyboardOffline } from "./game";

/**
 * Offline version of the game in the client (see ClientGameContext)
 */
export class ClientGameContextOffline extends ClientGameContext {
  spawner: Spawner;
  constructor(onFinish: () => void) {
    super(onFinish);
    setupKeyboardOffline(this.gameManager.game);
    this.spawner = new Spawner(
      this.spawnGraviton.bind(this),
      this.spawnPortal.bind(this)
    );
  }

  configure() {
    const game = this.gameManager.game;
    GameProducedEvent.registerEvent(GameEvent.BALL_OUT, (playerId: number) => {
      this.gameManager.game.emit(GameEvent.GOAL, playerId);
      this.handleGoal(playerId);
    });
    game.reset(0, 0, GSettings.BALL_INITIAL_SPEEDX, 0);
    this.animate(Date.now());
  }

  startGame() {
    const game = this.gameManager.game;
    game.start();
    this.spawner.startSpawning();
  }

  handleGoal(playerId: number) {
    const game = this.gameManager.game;
    const renderer = this.gameManager.renderer;
    game.pause();
    renderer.startVictoryAnimationAsync().then(() => {
      const speedX = (playerId == 0 ? -1 : 1) * GSettings.BALL_INITIAL_SPEEDX;
      game.reset(0, 0, speedX, 0);
      this.spawner.stopSpawning();
      renderer.scorePanels.goalAgainst(playerId);
      if (this.gameManager.game.isOver()) {
        this.onFinish();
      } else {
        delay(500).then(() => this.startGame());
      }
    });
  }

  spawnGraviton() {
    const game = this.gameManager.game;
    const [x, y] = randomGravitonCoords();
    game.emit(GameEvent.SPAWN_GRAVITON, game.state.data.actualNow, x, y);
  }

  spawnPortal() {
    const game = this.gameManager.game;
    const [x1, x2, y1, y2] = randomPortalCoords();
    game.emit(
      GameEvent.SPAWN_PORTAL,
      game.state.data.actualNow,
      x1,
      y1,
      x2,
      y2
    );
  }
}
