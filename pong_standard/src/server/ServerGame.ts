import now from "performance-now"
import { Socket } from "socket.io"
import { EventEmitter } from "stream";

const GAME_STEP = 1000 / 60;

function removeElementByValue<T>(array: T[], item: T) {
    var index = array.indexOf(item);
    if (index !== -1)
        array.splice(index, 1);
}

export class GameManager extends EventEmitter {
    lastTime: number;
    time: number;
    step: number;
    timeAccumulated: number;
    playerSockets: [Socket, Socket];
    observerSockets: Socket[];
    game: Game;

    constructor (
        playerSockets: [Socket, Socket],
        // onStop: (reason: string) => void,
        // onVictory: (winnerId: number) => void,
    ) {
        super();
        ///
        let i = 1;
        for (let socket of playerSockets) {
            socket.on("disconnect", (reason: string) => this.emit("stop", `Player ${i++} has disconnected (${reason})`))
        }
        ///
        this.playerSockets = playerSockets;
    }

    addObserver(socket: Socket) {
        this.observerSockets.push(socket);
        socket.on("disconnect", () => removeElementByValue(this.observerSockets, socket));
    }

    start() {
        this.lastTime = now();
        this.time = 0;
        this.timeAccumulated = 0;
        this.step = GAME_STEP;
        this.emit('start');
        setTimeout(this.frame.bind(this), GAME_STEP);
    }

    frame() {
        var newTime = now();
        var dt = (newTime - this.lastTime) / 1000;
        // if (dt > GAME_MAX_STEP)
        //     dt = this.step;
        this.timeAccumulated += dt;
        this.lastTime = newTime;
    
        while (this.timeAccumulated >= this.step) {
            this.time += this.step;
            this.timeAccumulated -= this.step;
            this.game.update(this.step);
        }

        // this.emit('ball', this.ball.position.x, this.ball.position.y);
    }

}

class Game {
    entities: Entities;
    score: [number, number];

    
    update(elapsed: number) {

    }

}

class Entities {
    ball: Ball;
    bars: [Bar, Bar];
}

class Ball extends EventEmitter {}

class Bar {}