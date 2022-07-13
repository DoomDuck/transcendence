// import { type BarKeyDownEvent, type BarKeyUpEvent, GameEvent, GSettings, PLAYER1, PLAYER2, PlayerID } from "../../common/constants";
import { GSettings } from "../../common/constants";
import { Game } from "../../common/game";
// import { Bar, Ball, GameState } from "../../common/entities";
// import { PlayersScore } from "../../common/entities";

/**
 * Extension of Game for server-specific behavior:
 * - Need to emit its ball's position
 * - Is responsible for the goal decision and score holding
 */
export class ServerGameManager {
    game: Game = new Game();
    score: [number, number] = [0, 0];

    constructor() {
        // this.onIn(GameEvent.RECEIVE_BAR_KEYDOWN, (playerId: PlayerID, ...args: BarKeyDownEvent) => this.state.bars[playerId].onReceiveKeydown(...args));
        // this.onIn(GameEvent.RECEIVE_BAR_KEYUP, (playerId: PlayerID, ...args: BarKeyDownEvent) => this.state.bars[playerId].onReceiveKeyup(...args));
        // Game loop
        setInterval(this.game.frame.bind(this), GSettings.GAME_STEP_MS);
    }

    // emitBallPosition() {
    //     this.emitOut(GameEvent.SEND_SET_BALL,
    //         this.state.ball.position.x,
    //         this.state.ball.position.y,
    //         this.state.ball.speed.x,
    //         this.state.ball.speed.y,
    //         Date.now()
    //     );
    // }

    // testGoal() {
    //     if (this.state.ball.gotOutOfScreen()) {
    //         this.emitOut(GameEvent.GOAL, this.state.ball.farthestPlayerSide());
    //     }
    // }

    // update(elapsed: number) {
    //     this.game.update();
    //     this.emitBallPosition();
    //     this.testGoal();
    // }
}
