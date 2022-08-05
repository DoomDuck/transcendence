import { io, Socket } from "socket.io-client";
import { GameEvent, PLAYER1, PLAYER2 } from "../common/constants";
import { GameProducedEvent } from "../common/game/events";
import { type ClientGameContext } from "./ClientGameContext";
import { ClientGameManager, setupKeyboardOnline } from "./game";

/**
 * Online version of the game in the client (see ClientGameContext)
 */
export class ClientGameContextOnline implements ClientGameContext {
  gameManager: ClientGameManager = new ClientGameManager();
  socket: Socket;
  ballOutAlreadyEmitted: boolean = false;

  constructor(public onFinish: () => void) {
    this.socket = io("http://localhost:5000/pong");
    this.socket.on("connect", () => {
      console.log("connected to server");
    });
    this.socket.on("disconnect", () => {
      console.log("disconnected from server");
    });

    // incomming events
    let game = this.gameManager.game;
    const transmitEventFromServerToGame = (event: string) => {
      this.socket.on(event, (...args: any[]) => {
        game.emit(event, ...args);
        console.log(`From server: ${event}: ${args}`);
      });
    };
    transmitEventFromServerToGame(GameEvent.START);
    transmitEventFromServerToGame(GameEvent.PAUSE);
    transmitEventFromServerToGame(GameEvent.RESET);
    this.socket.on(GameEvent.RESET, () => {
      this.ballOutAlreadyEmitted = false;
    });
    transmitEventFromServerToGame(GameEvent.SPAWN_GRAVITON);
    transmitEventFromServerToGame(GameEvent.SPAWN_PORTAL);
    transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_EVENT);
    transmitEventFromServerToGame(GameEvent.GOAL);
    this.socket.on(GameEvent.GOAL, (playerId: number) => {
      this.handleGoal(playerId);
    });
  }

  animate() {
    // animation loop
    let animate = (time: DOMHighResTimeStamp) => {
      requestAnimationFrame(animate);
      this.gameManager.game.frame();
      this.gameManager.render(time);
    };
    animate(Date.now());
  }

  startGame() {
    this.socket.on(
      "playerIdConfirmed",
      (playerId: number, ready: () => void) => {
        setupKeyboardOnline(this.gameManager.game, playerId, this.socket);
        this.setupBallOutOutgoingEvent(playerId);
        ready();
      }
    );
  }

  private setupBallOutOutgoingEvent(playerId: number) {
    GameProducedEvent.registerEvent(
      GameEvent.BALL_OUT,
      (playerIdBallOut: number) => {
        if (playerIdBallOut == playerId && !this.ballOutAlreadyEmitted) {
          this.socket.emit(GameEvent.BALL_OUT, playerIdBallOut);
          this.ballOutAlreadyEmitted = true;
        }
      }
    );
  }

  private handleGoal(playerId: number) {
    const game = this.gameManager.game;
    const renderer = this.gameManager.renderer;
    game.pause();
    renderer
      .startVictoryAnimationAsync()
      .then(() => renderer.scorePanels.goalAgainst(playerId))
      .then(() => {
        if (game.isOver()) {
          this.onFinish();
        } else {
          this.socket.emit(GameEvent.READY);
        }
      });
  }
}
