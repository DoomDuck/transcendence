import { GameEvent, GSettings, PLAYER1, PLAYER2 } from "../common";
import { Game } from "../common/Game";
import { Bar, Ball, LEFT, RIGHT, GameState } from "../common";
import { GameManager } from "./GameManager";

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
        this.stepsAccumulated = 0;
        this.on("update", () => this.onUpdate());
        setInterval(this.frame.bind(this), GSettings.GAME_STEP);
    }

    // launchGameLoop() {
    //     this.stepsAccumulated = 0;
    //     this.timeOutHandle = setInterval(this.frame.bind(this), GSettings.GAME_STEP);
    // }
    // pauseGameLoop() {
    //     clearInterval(this.timeOutHandle);
    // }

    onUpdate() {
        this.stepsAccumulated += 1;
        if (this.stepsAccumulated >= GSettings.SERVER_EMIT_INTERVAL) {
            // console.log(this.state.ball.position.x);
            this.emit(GameEvent.SET_BALL,
                this.state.ball.position.x,
                this.state.ball.position.y,
                this.state.ball.speed.x,
                this.state.ball.speed.y
            );
            this.stepsAccumulated = 0;
        }
    }
}
