import { GameEvent, GSettings } from "../../common/constants";
import { BarInputEvent, Game } from "../../common/game";
// import { Bar, Ball, GameState } from "../../common/entities";
// import { PlayersScore } from "../../common/entities";

/**
 * Extension of Game for server-specific behavior:
 * - Need to emit its ball's position
 * - Is responsible for the goal decision and score holding
 */
export class ServerGameManager {
  game: Game = new Game();

  constructor() {
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
