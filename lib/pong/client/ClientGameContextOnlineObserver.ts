import { Socket } from "socket.io-client";
import { GameEvent } from "../common/constants";
import type { ErrorCallback, FinishCallback } from "../common/utils";
import { ClientGameContextOnline } from "./ClientGameContextOnline";

/**
 * Online version of the game in the client as an observer (see ClientGameContext)
 */
export class ClientGameContextOnlineObserver extends ClientGameContextOnline {
  ballOutAlreadyEmitted: boolean = false;

  constructor(socket: Socket, onFinish: FinishCallback, onError: ErrorCallback) {
    super(socket, onFinish, onError);

    this.socket.on(GameEvent.OBSERVER_UPDATE, (gameDataPlainObject: any) => {
      assignRecursively(
        this.gameManager.game.state.data.current,
        gameDataPlainObject
      );
    });
    this.socket.on(GameEvent.PLAYER_DISCONNECT, (playerId: number) => {
      this.gameManager.game.pause();
      this.finally();
      this.onError!(`The player ${playerId + 1} has disconnected`);
    });
  }

  animate() {
    const animate = (time: DOMHighResTimeStamp) => {
      this.animationHandle = requestAnimationFrame(animate);
      this.gameManager.render(time);
    };
    animate(Date.now());
  }

  startGame() {}
}

function assignRecursively<T>(instance: T, plainObject: any) {
  for (let key in instance) {
    if (typeof instance[key] !== "object") {
      instance[key] = plainObject[key];
    } else {
      assignRecursively(instance[key], plainObject[key]);
    }
  }
}
