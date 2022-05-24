import { GSettings } from "../common";
import { Game } from "../common/Game";
import { Bar, Ball, LEFT, RIGHT, GameState } from "../common";

export class ServerGame extends Game {
    timeOutHandle: NodeJS.Timeout;
    constructor() {
        const gameState = new GameState(
            new Ball(),
            new Bar(LEFT),
            new Bar(RIGHT)
        );
        super(gameState);
    }

    startGameLoop() {
        this.timeOutHandle = setTimeout(this.frame.bind(this), GSettings.GAME_STEP);
    }
    stopGameLoop() {
        clearTimeout(this.timeOutHandle);
    }
}
