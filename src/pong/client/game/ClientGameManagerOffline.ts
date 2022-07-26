import { GSettings } from "../../common/constants";
import { handleKeydownOffline, handleKeyupOffline } from "./keyboardInput";
import { GameProducedEvent } from "../../common/game/events";
import { delay } from "../../common/utils";
import { ClientGameManager } from "./ClientGameManager";

/**
 * Specificities of the offline version regarding keyboard events
 */
export class ClientGameManagerOffline extends ClientGameManager {
  constructor() {
    super();

    window.addEventListener(
      "keydown",
      (e: KeyboardEvent) => handleKeydownOffline(e, this.game.state),
      false
    );
    window.addEventListener(
      "keyup",
      (e: KeyboardEvent) => handleKeyupOffline(e, this.game.state),
      false
    );
  }
}
