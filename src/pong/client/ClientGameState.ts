import { Vector3 } from "three";
import { Ball, Bar, GameEvent, GameState, GSettings, PLAYER1, PlayerID } from "../common";
import { ClientBall } from "./ClientBall";
import { ClientBar } from "./ClientBar";
import { ServerBall } from "./ServerBall";

export class ClientGameState extends GameState {
    serverBallEstimation: ServerBall;
    // serverBall: ServerBall;
    playerId: PlayerID;
    playerDirection: number;
    constructor(ball: ClientBall, bar1: ClientBar, bar2: ClientBar, playerId: PlayerID) {
        super(ball, bar1, bar2);
        this.serverBallEstimation = new ServerBall();
        // this.serverBall = new ServerBall();
        this.playerId = playerId;
        this.playerDirection = playerId == PLAYER1 ? -1 : 1;
        this.on(GameEvent.RECEIVE_SET_BALL, this.onReceiveSetBall.bind(this));
    }

    onReceiveSetBall(x: number, y: number, vx: number, vy: number, time: number) {
        let elapsed = Date.now() - time;
        // this.ball.position.set(x, y, 0);
        // this.ball.speed.set(vx, vy, 0);
        // this.ball.updatePosition(elapsed);
        this.serverBallEstimation.position.set(x, y, 0);
        this.serverBallEstimation.speed.set(vx, vy, 0);
        this.serverBallEstimation.update(elapsed);
        this.serverBallEstimation.handleCollisions(this.bars);
        this.ball.position.lerp(this.serverBallEstimation.position, .05);
    }

    // reset(ballSpeedX: number, ballSpeedY: number) {
    //     super.reset(ballSpeedX, ballSpeedY);
    //     this.serverBallEstimation.reset();
    //     this.serverBallEstimation.speed.set(ballSpeedX, ballSpeedY, 0);
    // }

    update(elapsed: number) {
        this.serverBallEstimation.update(elapsed);
        super.update(elapsed);
        this.serverBallEstimation.handleCollisions(this.bars);
        if (this.ball.position.x * this.playerDirection > GSettings.BALL_CONTROL_FRONTIER_X_CLIENT && !(this.ball as ClientBall).atMyLimit) {
            this.emit(GameEvent.SEND_SET_BALL,
                this.ball.position.x,
                this.ball.position.y,
                this.ball.speed.x,
                this.ball.speed.y,
                Date.now()
            );
        }
        // else if (this.ball.position.x * this.playerDirection <= GSettings.BALL_CONTROL_FRONTIER_X_SERVER) {
        // }
    }
}
