import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { GameManager } from '../../pong/server'

function removeElementByValue<T>(array: T[], item: T) {
    let index = array.indexOf(item);
    if (index !== -1)
        array.splice(index, 1);
}

@Injectable()
export class GameManagerService {
    private waitingClients: Socket[] = [];
    private games: GameManager[] = [];

    add(socket: Socket) {
        this.waitingClients.push(socket);
        this.launchGameIfPossible();
    }

    launchGameIfPossible() {
        if (this.waitingClients.length >= 2) {
            console.log("two clients are waiting for a game");
            const gameInstance = new GameManager([this.waitingClients[0], this.waitingClients[1]]);
            this.games.push(gameInstance);
            this.waitingClients[0].emit("playerIdConfirmed", 0, () => {
                console.log('player 0 ready');
                gameInstance.isReady(0);
            });
            this.waitingClients[1].emit("playerIdConfirmed", 1, () => {
                console.log('player 1 ready');
                gameInstance.isReady(1);
            });
            this.waitingClients.splice(0, 2);
        }
    }

    remove(socket: Socket) {
        removeElementByValue(this.waitingClients, socket);
    }

}
