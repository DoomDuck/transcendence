import { ClientGame } from "./game";
import { io, Socket } from "socket.io-client";
import { GameEvent } from "../common/constants";

/**
 * Root of the client code execution
 * Connect to the server's socket namespace upon creation
 * Then waits for server to confirm a game starts, and to tell/confirm the role the client has:
 * player 1, player 2 or observer (this is only relevant regarding the control the client will have)
 */
export class ClientContext {
  game?: ClientGame;
  socket: Socket;
  gameContainer: HTMLDivElement;
  gameRendererContainer: HTMLDivElement;
  gameLabelRendererContainer: HTMLDivElement;

  constructor() {
    this.socket = io("http://localhost:5000/pong");
    // error if not found ?
    this.gameContainer = document.getElementById(
      "game-container"
    ) as HTMLDivElement;
    this.gameRendererContainer = document.getElementById(
      "game-screen"
    ) as HTMLDivElement;
    this.gameLabelRendererContainer = document.getElementById(
      "game-text"
    ) as HTMLDivElement;

    this.socket.on("connect", () => {
      console.log("connected to server");
    });
    this.socket.on("disconnect", () => {
      if (this.game !== undefined) {
        this.gameRendererContainer.removeChild(this.game.renderer.domElement);
        this.gameLabelRendererContainer.removeChild(
          this.game.labelRenderer.domElement
        );
      }
    });
    this.socket.on(
      "playerIdConfirmed",
      (playerId: number, ready: () => void) => {
        this.startGame(playerId);
        ready();
      }
    );
  }

  startGame(playerId: number) {
    // game
    let game = new ClientGame(playerId, this.gameContainer);
    this.game = game;

    this.gameRendererContainer.appendChild(game.renderer.domElement);
    this.gameLabelRendererContainer.appendChild(game.labelRenderer.domElement);

    // // outgoing events
    const transmitEventFromGameToServer = (event: string) => {
      game.onOut(event, (...args: any[]) => {
        this.socket.emit(event, ...args);
      });
    };
    transmitEventFromGameToServer(GameEvent.SEND_BAR_KEYDOWN);
    transmitEventFromGameToServer(GameEvent.SEND_BAR_KEYUP);

    // incomming events
    const transmitEventFromServerToGame = (event: string) => {
      this.socket.on(event, (...args: any[]) => {
        game.emitIn(event, ...args);
      });
    };
    transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_KEYDOWN);
    transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_KEYUP);
    transmitEventFromServerToGame(GameEvent.RECEIVE_SET_BALL);
    transmitEventFromServerToGame(GameEvent.GOAL);
    transmitEventFromServerToGame(GameEvent.START);
    transmitEventFromServerToGame(GameEvent.RESET);
    transmitEventFromServerToGame(GameEvent.PAUSE);
    transmitEventFromServerToGame(GameEvent.UNPAUSE);

    // Game loop
    let animate = () => {
      requestAnimationFrame(animate);
      this.game?.frame();
      this.game?.render();
    };
    animate();
  }
}
