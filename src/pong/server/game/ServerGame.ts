import { type BarKeyDownEvent, type BarKeyUpEvent, GameEvent, GSettings, PLAYER1, PLAYER2, PlayerID } from "../../common/constants";
import { Game } from "../../common/game";
import { Bar, Ball, GameState } from "../../common/entities";
import { PlayersScore } from "../../common/game";
import { StandardPhysics } from "../../common/physics";

/**
 * Extension of Game for server-specific behavior:
 * - Need to emit its ball's position
 * - Is responsible for the goal detection
 */
export class ServerGame extends Game {
    ball: Ball;
    constructor() {
        const ball = new Ball();
        const bars: [Bar, Bar] = [
            new Bar(PLAYER1),
            new Bar(PLAYER2)
        ];
        const playersScore = new PlayersScore();
        const physics = new StandardPhysics(ball, bars);
        const gameState = new GameState(
            physics, [ball, bars[0], bars[1]]
        );
        super(gameState, playersScore);
        this.ball = ball;
        this.onIn(GameEvent.RECEIVE_BAR_KEYDOWN, (playerId: PlayerID, ...args: BarKeyDownEvent) => bars[playerId].onReceiveKeydown(...args));
        this.onIn(GameEvent.RECEIVE_BAR_KEYUP, (playerId: PlayerID, ...args: BarKeyDownEvent) => bars[playerId].onReceiveKeyup(...args));
        // Game loop
        setInterval(this.frame.bind(this), GSettings.GAME_STEP);
    }

    emitBallPosition() {
        this.emitOut(GameEvent.SEND_SET_BALL,
            this.ball.position.x,
            this.ball.position.y,
            this.ball.speed.x,
            this.ball.speed.y,
            Date.now()
        );
    }

    testGoal() {
        if (this.ball.gotOutOfScreen()) {
            this.emitOut(GameEvent.GOAL, this.ball.farthestPlayerSide());
        }
    }

    update(elapsed: number) {
        super.update(elapsed);
        this.emitBallPosition();
        this.testGoal();
    }
}
