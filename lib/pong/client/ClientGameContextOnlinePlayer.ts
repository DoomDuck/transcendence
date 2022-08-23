import { Socket } from "socket.io-client";
import { GameEvent } from "../common/constants";
import { GameProducedEvent } from "../common/game/events";
import { ClientGameContextOnline } from "./ClientGameContextOnline";
import { setupKeyboardOnline } from "./game";

/**
 * Online version of the game in the client as a player (see ClientGameContext)
 */
export class ClientGameContextOnlinePlayer extends ClientGameContextOnline {
  ballOutAlreadyEmitted: boolean = false;

  constructor(socket: Socket, onFinish: () => void) {
    super(socket, onFinish);
    this.socket.on("connect", () => {
      console.log("connected to server");
      this.socket.emit("joinMatchMaking");
    });
    this.socket.on("disconnect", () => {
      console.log("disconnected from server");
    });

    // incomming events
    this.transmitEventFromServerToGame(GameEvent.START);
    this.transmitEventFromServerToGame(GameEvent.PAUSE);
    this.socket.on(GameEvent.RESET, () => {
      this.ballOutAlreadyEmitted = false;
    });
    this.transmitEventFromServerToGame(GameEvent.SPAWN_GRAVITON);
    this.transmitEventFromServerToGame(GameEvent.SPAWN_PORTAL);
    this.transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_EVENT);
  }

  animate() {
    // animation loop
    const animate = (time: DOMHighResTimeStamp) => {
      this.animationHandle = requestAnimationFrame(animate);
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
}
