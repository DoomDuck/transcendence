import { GSettings } from "../common/constants";
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
    let cpt = 0;
    let spawnWidth = GSettings.GAME_WIDTH / 2;
    let spawnHeight = GSettings.GAME_HEIGHT - GSettings.GRAVITON_SIZE;
    setInterval(() => {
      let x = Math.random() * spawnWidth - spawnWidth / 2;
      let y = Math.random() * spawnHeight - spawnHeight / 2;
      game.state.data.addGraviton(game.state.data.currentIndex, cpt++, x, y);
    }, 3000);
    this.animate(Date.now());
  }
}
