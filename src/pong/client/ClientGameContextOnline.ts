import { io, Socket } from "socket.io-client";
import { GameEvent } from "../common/constants";
import { ClientGameContext } from "./ClientGameContext";

/**
 * Utility class to store common behavior between
 * ClientGameContextOnlinePlayer and ClientGameContextOnlineObserver
 */
export abstract class ClientGameContextOnline extends ClientGameContext {
  socket: Socket;

  constructor(onFinish: () => void) {
    super(onFinish);
    this.socket = io("http://localhost:5000/pong");

    this.transmitEventFromServerToGame(GameEvent.RESET);
    this.transmitEventFromServerToGame(GameEvent.GOAL);
    this.socket.on(GameEvent.GOAL, (playerId: number) => {
      this.handleGoal(playerId);
    });
  }

  protected transmitEventFromServerToGame(event: string) {
    this.socket.on(event, (...args: any[]) => {
      this.gameManager.game.emit(event, ...args);
      console.log(`From server: ${event}: ${args}`);
    });
  }

  protected handleGoal(playerId: number) {
    const game = this.gameManager.game;
    const renderer = this.gameManager.renderer;
    game.pause();
    renderer
      .startVictoryAnimationAsync()
      .then(() => renderer.scorePanels.goalAgainst(playerId))
      .then(() => {
        if (game.isOver()) {
          this.handleEndOfGame();
        } else {
          this.socket.emit(GameEvent.READY);
        }
      });
  }
}
