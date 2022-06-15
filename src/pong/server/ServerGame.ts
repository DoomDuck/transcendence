import { type BarKeyDownEvent, type BarKeyUpEvent, GameEvent, GSettings, PLAYER1, PLAYER2, PlayerID, NonPhysicBall, PhysicBall } from "../common";
import { Game } from "../common/Game";
import { Bar, Ball, LEFT, RIGHT, GameState } from "../common";
import { ServerGameState } from "./ServerGameState";

export class ServerGame extends Game {
    timeOutHandle: NodeJS.Timeout;
    constructor() {
        const bar1 = new Bar(PLAYER1);
        const bar2 = new Bar(PLAYER2);
        const ball = new PhysicBall([bar1, bar2]);
        const gameState = new ServerGameState(ball, bar1, bar2);
        super(gameState);
        this.on(GameEvent.RECEIVE_BAR_KEYDOWN, (playerId: PlayerID, ...args: BarKeyDownEvent) => this.state.bars[playerId].onReceiveKeydown(...args));
        this.on(GameEvent.RECEIVE_BAR_KEYUP, (playerId: PlayerID, ...args: BarKeyUpEvent) => this.state.bars[playerId].onReceiveKeyup(...args));
        // Game loop
        setInterval(this.frame.bind(this), GSettings.GAME_STEP);
    }
}
