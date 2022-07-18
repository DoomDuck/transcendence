import { GameEvent, GSettings } from "../common/constants";
import { SpawnGravitonEvent } from "../common/game/events";
import { ClientGameContext } from "./ClientGameContext";
import { ClientGameManagerOffline } from "./game/ClientGameManagerOffline";

export class ClientGameContextOffline extends ClientGameContext {
  constructor() {
    super();
    this.gameManager = new ClientGameManagerOffline();
  }
  startGame() {
    let game = this.gameManager.game;
    game.reset(0, 0, GSettings.BALL_INITIAL_SPEEDX, 0);
    game.start();
    setInterval(() => {
      let x = GSettings.GRAVITON_SPAWN_WIDTH * (Math.random() - 0.5);
      let y = GSettings.GRAVITON_SPAWN_HEIGHT * (Math.random() - 0.5);
      game.emit(GameEvent.SPAWN_GRAVITON, game.state.data.actualNow, x, y);
      // game.state.registerEvent(new SpawnGravitonEvent(game.state.data.actualNow, x, y));
    }, 3000);
    this.animate(Date.now());
  }
}
