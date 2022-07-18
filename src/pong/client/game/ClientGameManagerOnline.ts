import { GameEvent, PLAYER1, PLAYER2 } from "../../common/constants";
import { handleKeyOnline } from "./keyboardInput";
import { Socket } from "socket.io-client";
import { ClientGameManager } from "./ClientGameManager";
import { GameProducedEvent } from "../../common/game/events";

export class ClientGameManagerOnline extends ClientGameManager {
  socket: Socket;
  playerId: number;
  otherPlayerId: number;

  setup(socket: Socket, playerId: number) {
    this.socket = socket;
    this.playerId = playerId;
    this.otherPlayerId = this.playerId == PLAYER1 ? PLAYER2 : PLAYER1;

    window.addEventListener(
      "keydown",
      (e: KeyboardEvent) =>
        handleKeyOnline(e, this.game.state, playerId, socket, true),
      false
    );
    window.addEventListener(
      "keyup",
      (e: KeyboardEvent) =>
        handleKeyOnline(e, this.game.state, playerId, socket, false),
      false
    );
  }
}
