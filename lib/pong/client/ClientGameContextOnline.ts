import { Socket } from "socket.io-client";
import { GameEvent } from "../common/constants";
import type { ErrorCallback, FinishCallback } from "../common/utils";
import { ClientGameContext } from "./ClientGameContext";

/**
 * Utility class to store common behavior between
 * ClientGameContextOnlinePlayer and ClientGameContextOnlineObserver
 */
export abstract class ClientGameContextOnline extends ClientGameContext {
  constructor(public socket: Socket, onFinish: FinishCallback, onError: ErrorCallback) {
    super(onFinish, onError);

    this.transmitEventFromServerToGame(GameEvent.RESET);
    this.transmitEventFromServerToGame(GameEvent.GOAL);
    this.socket.on(GameEvent.GOAL, (playerId: number) => {
      this.handleGoal(playerId);
    });
    this.socket.on(GameEvent.GAME_OVER, (score: [number, number]) => {
      this.handleEndOfGame(score);
    })
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
