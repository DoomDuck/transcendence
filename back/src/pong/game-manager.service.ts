import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { removeIfPresent } from 'pong';
import { ServerGameContext } from 'pong';

@Injectable()
export class GameManagerService {
  private waitingClients: Socket[] = [];
  private games: ServerGameContext[] = [];
  private logger: Logger = new Logger('GameManagerService');

  add(socket: Socket) {
    this.waitingClients.push(socket);
    this.launchGameIfPossible();
    socket.on('disconnect', () => {
      removeIfPresent(this.waitingClients, socket);
    });
  }

  addObserver(socket: Socket, gameId: number) {
    // TOCHANGE (debug): need to work with the front part
    // currently: launch a game before observing
    this.games[0].addObserver(socket);
    console.log('OBSERVER INCOOOOOOOOOOOMINNNNG');
  }

  launchGameIfPossible() {
    if (this.waitingClients.length >= 2) {
      this.logger.log('two clients are waiting for a game');
      const gameInstance: ServerGameContext = new ServerGameContext(
        [this.waitingClients[0], this.waitingClients[1]],
        () => removeIfPresent(this.games, gameInstance),
      );
      this.games.push(gameInstance);
      this.waitingClients[0].emit('playerIdConfirmed', 0, () => {
        this.logger.log('player 0 ready');
        gameInstance.isReady(0);
      });
      this.waitingClients[1].emit('playerIdConfirmed', 1, () => {
        this.logger.log('player 1 ready');
        gameInstance.isReady(1);
      });
      this.waitingClients.splice(0, 2);
    }
  }
}
