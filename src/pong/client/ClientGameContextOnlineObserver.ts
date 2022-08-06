import { io, Socket } from "socket.io-client";
import { GameEvent, GSettings, PLAYER1, PLAYER2 } from "../common/constants";
import { GameProducedEvent } from "../common/game/events";
import { ClientGameContext } from "./ClientGameContext";
import { ClientGameContextOnline } from "./ClientGameContextOnline";
import { ClientGameManager, setupKeyboardOnline } from "./game";

/**
 * Online version of the game in the client as an observer (see ClientGameContext)
 */
export class ClientGameContextOnlineObserver extends ClientGameContextOnline {
  socket: Socket;
  ballOutAlreadyEmitted: boolean = false;

  constructor(onFinish: () => void) {
    //, public observer = false) {
    super(onFinish);
    this.socket.on("connect", () => {
      console.log("connected to server");

      // TOCHANGE (debug): need to work with the front part
      this.socket.emit("observe", NaN);
      this.socket.on(GameEvent.OBSERVER_UPDATE, (gameDataPlainObject: any) => {
        assignRecursively(
          this.gameManager.game.state.data.current,
          gameDataPlainObject
        );
      });
    });
    this.socket.on("disconnect", () => {
      console.log("disconnected from server");
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

  // private handleGoal(playerId: number) {
  //   const game = this.gameManager.game;
  //   const renderer = this.gameManager.renderer;
  //   game.pause();
  //   renderer
  //     .startVictoryAnimationAsync()
  //     .then(() => renderer.scorePanels.goalAgainst(playerId))
  //     .then(() => {
  //       if (game.isOver()) {
  //         this.handleEndOfGame();
  //       }
  //     });
  // }
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
