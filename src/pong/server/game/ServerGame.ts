import { type BarKeyDownEvent, type BarKeyUpEvent, GameEvent, GSettings, PLAYER1, PLAYER2, PlayerID } from "../../common/constants";
import { Game } from "../../common/game";
import { Bar, Ball, GameState } from "../../common/entities";
import { PlayersScore } from "../../common/entities";

/**
 * Extension of the common Game features:
 * - In the server the bar events are incomming for both, and need an extra parameter to select which bar
 * - The server need to emit its ball's position
 * - Equally, the server is responsible for the goal detection
 */
export class ServerGame extends Game {
    timeOutHandle: NodeJS.Timeout;
    playersScore: PlayersScore;

    constructor() {
        const gameState = new GameState(
            new Ball(),
            new Bar(PLAYER1),
            new Bar(PLAYER2),
            new PlayersScore()
        );
        super(gameState);
        this.on(GameEvent.RECEIVE_BAR_KEYDOWN, (playerId: PlayerID, ...args: BarKeyDownEvent) => this.state.bars[playerId].onReceiveKeydown(...args));
        this.on(GameEvent.RECEIVE_BAR_KEYUP, (playerId: PlayerID, ...args: BarKeyUpEvent) => this.state.bars[playerId].onReceiveKeyup(...args));
        // Game loop
        setInterval(this.frame.bind(this), GSettings.GAME_STEP);
    }

    emitBallPosition() {
        this.emit(GameEvent.SEND_SET_BALL,
            this.state.ball.position.x,
            this.state.ball.position.y,
            this.state.ball.speed.x,
            this.state.ball.speed.y,
            Date.now()
        );
    }

    testGoal() {
        if (this.state.ball.gotOutOfScreen()) {
            this.emit(GameEvent.GOAL, this.state.ball.farthestPlayerSide());
        }
    }

    update(elapsed: number) {
        super.update(elapsed);
        this.emitBallPosition();
        this.testGoal();
    }
}
