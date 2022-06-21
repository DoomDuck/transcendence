import { type BarKeyDownEvent, type BarKeyUpEvent, GameEvent, GSettings, PLAYER1, PLAYER2, PlayerID } from "../../common/constants";
import { Game } from "../../common/game";
import { Bar, Ball, GameState } from "../../common/entities";
import { PlayersScore } from "../../common/entities";
import { NonPhysicBall } from "../../common/entities/NonPhysicBall";

/**
 * Extension of Game for server-specific behavior:
 * - Need to emit its ball's position
 * - Is responsible for the goal detection
 */
export class ServerGame extends Game {
    timeOutHandle: NodeJS.Timeout;
    playersScore: PlayersScore;

    constructor() {
        const gameState = new GameState(
            new NonPhysicBall(),
            new Bar(PLAYER1),
            new Bar(PLAYER2),
            new PlayersScore()
        );
        super(gameState);
        this.onIn(GameEvent.RECEIVE_BAR_KEYDOWN, (playerId: PlayerID, ...args: BarKeyDownEvent) => this.state.bars[playerId].onReceiveKeydown(...args));
        this.onIn(GameEvent.RECEIVE_BAR_KEYUP, (playerId: PlayerID, ...args: BarKeyDownEvent) => this.state.bars[playerId].onReceiveKeyup(...args));
        // Game loop
        setInterval(this.frame.bind(this), GSettings.GAME_STEP);
    }

    emitBallPosition() {
        this.emitOut(GameEvent.SEND_SET_BALL,
            this.state.ball.position.x,
            this.state.ball.position.y,
            this.state.ball.speed.x,
            this.state.ball.speed.y,
            Date.now()
        );
    }

    testGoal() {
        if (this.state.ball.gotOutOfScreen()) {
            this.emitOut(GameEvent.GOAL, this.state.ball.farthestPlayerSide());
        }
    }

    update(elapsed: number) {
        super.update(elapsed);
        this.emitBallPosition();
        this.testGoal();
    }
}
