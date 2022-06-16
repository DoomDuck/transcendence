import { GameState } from "../../common/entities"
import { GSettings, PLAYER1, PLAYER2 } from "../../common/constants";
import { ClientBar } from "./ClientBar";
import { ClientBall } from "./ClientBall";
import { ServerBall } from "./ServerBall";

export class ClientGameState extends GameState {

    constructor(ball: ServerBall, bar1: ClientBar, bar2: ClientBar, public clientBall: ClientBall) {
        super(ball, bar1, bar2);
    }

    get serverBall(): ServerBall {
        return this.ball as ServerBall;
    }

    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
        super.reset(ballX, ballY, ballSpeedX, ballSpeedY);
        this.clientBall.reset(ballX, ballY, ballSpeedX, ballSpeedY);
    }

    update(elapsed: number) {
        this.clientBall.update(elapsed);
        this.bars[PLAYER1].update(elapsed);
        this.bars[PLAYER2].update(elapsed);
        this.clientBall.handleCollisions(this.bars);
        const dist = this.ball.position.distanceTo(this.serverBall.position)
        if (dist > GSettings.BALL_CLIENT_SERVER_LERP_DIST) {
            this.clientBall.position.lerp(this.serverBall.position, GSettings.BALL_CLIENT_SERVER_LERP_FACTOR);
        }
  }
}
