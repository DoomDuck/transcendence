import { type BarKeyDownEvent, type BarKeyUpEvent, GameEvent, GSettings, PLAYER1, PLAYER2, PlayerID } from "../common";
import { Game } from "../common/Game";
import { Bar, Ball, LEFT, RIGHT, GameState } from "../common";
import { ServerGameState } from "./ServerGameState";

export class ServerGame extends Game {
    timeOutHandle: NodeJS.Timeout;
    constructor() {
        const gameState = new ServerGameState(
            new Ball(),
            new Bar(PLAYER1),
            new Bar(PLAYER2)
        );
        super(gameState);
        this.on(GameEvent.RECEIVE_BAR_KEYDOWN, (playerId: PlayerID, ...args: BarKeyDownEvent) => this.state.bars[playerId].onReceiveKeydown(...args));
        this.on(GameEvent.RECEIVE_BAR_KEYUP, (playerId: PlayerID, ...args: BarKeyUpEvent) => this.state.bars[playerId].onReceiveKeyup(...args));
        // Game loop
        setInterval(this.frame.bind(this), GSettings.GAME_STEP);
    }
}
