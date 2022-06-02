import { GameEvent, GSettings, PLAYER1, PLAYER2 } from "../../pong/common";
import { Game } from "../../pong/common/Game";
import { Bar, Ball, LEFT, RIGHT, GameState } from "../../pong/common";

export class ServerGame extends Game {
    timeOutHandle: NodeJS.Timeout;
    stepsAccumulated: number;
    constructor() {
        const gameState = new GameState(
            new Ball(),
            new Bar(PLAYER1),
            new Bar(PLAYER2),
        );
        super(gameState);
        // ////
        // var oldEmit = this.emit;
        // this.emit = function(event: string, ...args: any[]) {
        //     console.log(`got event ${event}`)
        //     return oldEmit.apply(this, [event, ...args]);
        // }
        // ////
        this.stepsAccumulated = 0;
        // Game loop
        setInterval(this.frame.bind(this), GSettings.GAME_STEP);
    }
}
