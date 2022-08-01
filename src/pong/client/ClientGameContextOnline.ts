import { io, Socket } from "socket.io-client";
import { GameEvent, PLAYER1, PLAYER2 } from "../common/constants";
import { GameProducedEvent } from "../common/game/events";
import { ClientGameContext } from "./ClientGameContext";
import { setupKeyboardOnline } from "./game";

/**
 * Online version of the game in the client (see ClientGameContext)
 */
export class ClientGameContextOnline extends ClientGameContext {
  socket: Socket;
  playerId: number;
  otherPlayerId: number;
  ballOutAlreadyEmitted: boolean = false;

  configure() {
    this.socket = io("http://localhost:5000/pong");
    this.socket.on("connect", () => {
      console.log("connected to server");
    });
    this.socket.on("disconnect", () => {
      console.log("disconnected from server");
    });

    // // incomming events
    let game = this.gameManager.game;
    const transmitEventFromServerToGame = (event: string) => {
      this.socket.on(event, (...args: any[]) => {
        game.emit(event, ...args);
        console.log(`From server: ${event}: ${args}`);
      });
    };
    transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_EVENT);
    transmitEventFromServerToGame(GameEvent.START);
    transmitEventFromServerToGame(GameEvent.RESET);
    this.socket.on(GameEvent.RESET, () => {
      this.ballOutAlreadyEmitted = false;
    });
    transmitEventFromServerToGame(GameEvent.PAUSE);
    transmitEventFromServerToGame(GameEvent.SPAWN_GRAVITON);
    transmitEventFromServerToGame(GameEvent.SPAWN_PORTAL);
    transmitEventFromServerToGame(GameEvent.GOAL);
    this.socket.on(GameEvent.GOAL, (playerId: number) => {
      this.handleGoal(playerId);
    });

    // outgoing event

    GameProducedEvent.registerEvent(GameEvent.BALL_OUT, (playerId: number) => {
      if (playerId == this.playerId && !this.ballOutAlreadyEmitted) {
        this.socket.emit(GameEvent.BALL_OUT, playerId);
        this.ballOutAlreadyEmitted = true;
      }
    });
  }

  startGame() {
    this.socket.on(
      "playerIdConfirmed",
      (playerId: number, ready: () => void) => {
        this.playerId = playerId;
        this.otherPlayerId = this.playerId == PLAYER1 ? PLAYER2 : PLAYER1;
        setupKeyboardOnline(this.gameManager.game, playerId, this.socket);
        this.animate(Date.now());
        ready();
      }
    );
  }

  handleGoal(playerId: number) {
    const game = this.gameManager.game;
    const renderer = this.gameManager.renderer;
    game.pause();
    renderer
      .startVictoryAnimationAsync()
      .then(() => renderer.scorePanels.goalAgainst(playerId))
      .then(() => {
        if (this.gameManager.game.isOver()) this.onFinish();
        else this.socket.emit(GameEvent.READY);
      });
  }
}
