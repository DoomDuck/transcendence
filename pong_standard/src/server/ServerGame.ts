import { GSettings } from "../common";
import { Game } from "../common/Game";

export class ServerGame extends Game {
    timeOutHandle: NodeJS.Timeout;
    startGameLoop() {
        this.timeOutHandle = setTimeout(this.frame.bind(this), GSettings.GAME_STEP);
    }
    stopGameLoop() {
        clearTimeout(this.timeOutHandle);
    }
}
