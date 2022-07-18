import { io, Socket } from "socket.io-client";
import { GameEvent } from "../common/constants";
import { ClientGameContext } from "./ClientGameContext";
import { ClientGameManagerOnline } from "./game/ClientGameManagerOnline";

export class ClientGameContextOnline extends ClientGameContext {
  socket: Socket;
  constructor() {
    super();
    this.gameManager = new ClientGameManagerOnline();
  }

  connect() {
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
    transmitEventFromServerToGame(GameEvent.PAUSE);
    this.socket.on(GameEvent.GOAL, (playerId: number) => {
      game.pause();
      this.gameManager.renderer
        .startVictoryAnimationAsync()
        .then(() => this.gameManager.renderer.scorePanels.goalAgainst(playerId))
        .then(() => this.socket.emit(GameEvent.READY));
    });
  }

  startGame() {
    this.socket.on(
      "playerIdConfirmed",
      (playerId: number, ready: () => void) => {
        (this.gameManager as ClientGameManagerOnline).setup(
          this.socket,
          playerId
        );
        this.animate(Date.now());
        ready();
      }
    );
  }
}
