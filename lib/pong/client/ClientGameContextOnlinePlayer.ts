import { Socket } from "socket.io-client";
import { GameEvent } from "../common/constants";
import { ClientGameContextOnline } from "./ClientGameContextOnline";
import { setupKeyboardOnline } from "./game";
import { ChatEvent } from "backFrontCommon";
import type { ErrorCallback, FinishCallback } from "../common/utils";

/**
 * Online version of the game in the client as a player (see ClientGameContext)
 */
export class ClientGameContextOnlinePlayer extends ClientGameContextOnline {
  // ballOutAlreadyEmitted: boolean = false;
  playerId?: number;

  constructor(socket: Socket, onFinish: FinishCallback, onError: ErrorCallback) {
    super(socket, onFinish, onError);

    // incomming events
    this.transmitEventFromServerToGame(GameEvent.START);
    this.transmitEventFromServerToGame(GameEvent.PAUSE);
    // this.socket.on(GameEvent.RESET, () => {
    //   this.ballOutAlreadyEmitted = false;
    // });
    this.transmitEventFromServerToGame(GameEvent.SPAWN_GRAVITON);
    this.transmitEventFromServerToGame(GameEvent.SPAWN_PORTAL);
    this.transmitEventFromServerToGame(GameEvent.RECEIVE_BAR_EVENT);

    this.socket.on(
      ChatEvent.PLAYER_ID_CONFIRMED,
      (playerId: number, ready: () => void) => {
        setupKeyboardOnline(this.gameManager.game, playerId, this.socket);
        // this.setupBallOutOutgoingEvent(playerId);
        this.playerId = playerId;
        ready();
      }
    );

    this.socket.on(GameEvent.PLAYER_DISCONNECT, (_) => {
      this.gameManager.game.pause();
      this.finally();
      this.onError!("The other player has disconnected");
    });
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

  startGame() {}

  // private setupBallOutOutgoingEvent(playerId: number) {
  //   GameProducedEvent.registerEvent(
  //     GameEvent.BALL_OUT,
  //     (playerIdBallOut: number) => {
  //       if (playerIdBallOut == playerId && !this.ballOutAlreadyEmitted) {
  //         this.socket.emit(GameEvent.BALL_OUT, playerIdBallOut);
  //         this.ballOutAlreadyEmitted = true;
  //       }
  //     }
  //   );
  // }
}
