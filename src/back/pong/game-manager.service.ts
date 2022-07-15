<<<<<<< HEAD
import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { removeElementByValue } from '../../pong/common/utils';
import { GameManager } from '../../pong/server'

=======
import { Injectable, Logger } from "@nestjs/common";
import { Socket } from "socket.io";
import { GameManager } from "../../pong/server";

function removeElementByValue<T>(array: T[], item: T) {
  let index = array.indexOf(item);
  if (index !== -1) array.splice(index, 1);
}

>>>>>>> main
@Injectable()
export class GameManagerService {
  private waitingClients: Socket[] = [];
  private games: GameManager[] = [];
  private logger: Logger = new Logger("GameManagerService");

  add(socket: Socket) {
    this.waitingClients.push(socket);
    this.launchGameIfPossible();
  }

  launchGameIfPossible() {
    if (this.waitingClients.length >= 2) {
      this.logger.log("two clients are waiting for a game");
      const gameInstance = new GameManager([
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

  remove(socket: Socket) {
    removeElementByValue(this.waitingClients, socket);
  }
}
