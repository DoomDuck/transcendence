import { type BarKeyDownEvent, type BarKeyUpEvent, GameEvent, GSettings, PLAYER1, PLAYER2, PlayerID } from "../common";
import { Game } from "../common/Game";
import { Bar, Ball, LEFT, RIGHT, GameState } from "../common";
import { ServerGameState } from "./ServerGameState";

export class ServerGame extends Game {
    timeOutHandle: NodeJS.Timeout;
    stepsAccumulated: number;
    constructor() {
        const gameState = new ServerGameState(
            new Ball(),
            new Bar(PLAYER1),
            new Bar(PLAYER2)
        );
        super(gameState);
        this.on(GameEvent.RECEIVE_BAR_KEYDOWN_SERVER, (playerId: PlayerID, ...args: BarKeyDownEvent) => this.state.bars[playerId].onReceiveKeydown(...args));
        this.on(GameEvent.RECEIVE_BAR_KEYUP_SERVER, (playerId: PlayerID, ...args: BarKeyUpEvent) => this.state.bars[playerId].onReceiveKeyup(...args));
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
