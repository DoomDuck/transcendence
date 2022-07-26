import { Injectable, Logger } from "@nestjs/common";
import { Socket } from "socket.io";
import { ServerGameContext } from "../../pong/server";

@Injectable()
export class GameManagerService {
  private waitingClients: Socket[] = [];
  private games: ServerGameContext[] = [];
  private logger: Logger = new Logger("GameManagerService");

  add(socket: Socket) {
    this.waitingClients.push(socket);
    this.launchGameIfPossible();
  }

  launchGameIfPossible() {
    if (this.waitingClients.length >= 2) {
      this.logger.log("two clients are waiting for a game");
      const gameInstance = new ServerGameContext([
        this.waitingClients[0],
        this.waitingClients[1],
      ]);
      this.games.push(gameInstance);
      this.waitingClients[0].emit("playerIdConfirmed", 0, () => {
        this.logger.log("player 0 ready");
        gameInstance.isReady(0);
      });
      this.waitingClients[1].emit("playerIdConfirmed", 1, () => {
        this.logger.log("player 1 ready");
        gameInstance.isReady(1);
      });
      this.waitingClients.splice(0, 2);
    }
  }
}
