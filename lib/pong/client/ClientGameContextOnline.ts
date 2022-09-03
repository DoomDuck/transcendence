import { Socket } from "socket.io-client";
import { GameEvent } from "../common/constants";
import { Listeners, type ErrorCallback, type FinishCallback } from "../common/utils";
import { ClientGameContext } from "./ClientGameContext";

/**
 * Utility class to store common behavior between
 * ClientGameContextOnlinePlayer and ClientGameContextOnlineObserver
 */
export abstract class ClientGameContextOnline extends ClientGameContext {
  lastGoalPlayerId: number = -1;
  listeners: Listeners<Socket> = new Listeners();

  constructor(public socket: Socket, onFinish: FinishCallback, onError: ErrorCallback) {
    super(onFinish, onError);

    this.transmitEventFromServerToGame(GameEvent.RESET);
    this.listeners.add(this.socket, GameEvent.RESET, () => {
      if (this.lastGoalPlayerId >= 0)
        this.gameManager.renderer.scorePanels.goalAgainst(this.lastGoalPlayerId);
      this.gameManager.renderer.victoryAnimation = undefined;
    })
    this.transmitEventFromServerToGame(GameEvent.GOAL);
    this.listeners.add(this.socket, GameEvent.GOAL, (playerId: number) => {
      this.handleGoal(playerId);
    });
    this.listeners.add(this.socket, GameEvent.GAME_OVER, (score: [number, number]) => {
      this.handleEndOfGame(score);
    })
  }

  protected transmitEventFromServerToGame(event: string) {
    this.listeners.add(this.socket, event, (...args: any[]) => {
      this.gameManager.game.emit(event, ...args);
      console.log(`From server: ${event}: ${args}`);
    });
  }

  protected handleGoal(playerId: number) {
    const game = this.gameManager.game;
    const renderer = this.gameManager.renderer;
    game.pause();
    renderer.startVictoryAnimationAsync();
    this.lastGoalPlayerId = playerId;
  }

  protected errorExit(errorMessage: string) {
    this.gameManager.game.pause();
    this.finally();
    this.onError!(errorMessage);
  }

  public finally(): void {
    this.listeners.removeAll();
    super.finally();
  }

  abstract exitGame(): void;
}
