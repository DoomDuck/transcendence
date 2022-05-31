import { GameEvent, GSettings, PLAYER1, PLAYER2 } from "../common";
import { Game } from "../common/Game";
import { Bar, Ball, LEFT, RIGHT, GameState } from "../common";

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
        this.on("update", () => this.onUpdate());
        // Game loop
        setInterval(this.frame.bind(this), GSettings.GAME_STEP);
    }

    onUpdate() {

        this.stepsAccumulated += 1;
        if (this.stepsAccumulated >= GSettings.SERVER_EMIT_INTERVAL) {
            this.emit(GameEvent.SET_BALL,
                this.state.ball.position.x,
                this.state.ball.position.y,
                this.state.ball.speed.x,
                this.state.ball.speed.y,
                Date.now(),
            );
            this.stepsAccumulated = 0;
            // console.log(`${this.state.ball.position.x}, ${this.state.ball.position.y}`);
        }
    }
}
