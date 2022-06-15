import { Bar, GameState, GSettings, PLAYER1, PLAYER2 } from "../common";
import { ClientBall } from "./ClientBall";
import { ServerBall } from "./ServerBall";
import { Vector3 } from 'three'

function lerpIfTooFar(v1: Vector3, v2: Vector3, distThreshold: number, lerpFactor: number) {

}

export class ClientGameState extends GameState {

    constructor(ball: ServerBall, bar1: Bar, bar2: Bar, public clientBall: ClientBall) {
        super(ball, bar1, bar2);
    }

    get serverBall(): ServerBall {
        return this.ball as ServerBall;
    }

    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
        super.reset(ballX, ballY, ballSpeedX, ballSpeedY);
        this.clientBall.reset(ballX, ballY, ballSpeedX, ballSpeedY);
    }

    lerpIfTooFar() {
        const dist = this.clientBall.position.distanceTo(this.serverBall.position)
        if (dist > GSettings.BALL_CLIENT_SERVER_LERP_DIST) {
            this.clientBall.position.lerp(this.serverBall.position, GSettings.BALL_CLIENT_SERVER_LERP_FACTOR);
            this.clientBall.speed.copy(this.serverBall.speed);
        }
    }

    update(elapsed: number) {
        this.clientBall.update(elapsed);
        this.bars[PLAYER1].update(elapsed);
        this.bars[PLAYER2].update(elapsed);
        this.clientBall.handleCollisions(this.bars);
        this.lerpIfTooFar();
  }
}
