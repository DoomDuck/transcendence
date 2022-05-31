import { Vector3 } from "three";
import { Ball, Bar, GameEvent, GameState, GSettings, PLAYER1, PlayerID } from "../common";
import { ServerBall } from "./ServerBall";

export class ClientGameState extends GameState {
    // serverBallEstimation: ServerBall;
    // serverBall: ServerBall;
    playerId: PlayerID;
    playerDirection: number;
    constructor(ball: Ball, bar1: Bar, bar2: Bar, playerId: PlayerID) {
        super(ball, bar1, bar2);
        // this.serverBallEstimation = new ServerBall();
        // this.serverBall = new ServerBall();
        this.playerId = playerId;
        this.playerDirection = playerId == PLAYER1 ? -1 : 1;
        this.on(GameEvent.RECEIVE_SET_BALL, this.onReceiveSetBall.bind(this));
    }

    onReceiveSetBall(x: number, y: number, vx: number, vy: number, time: number) {
        let elapsed = Date.now() - time;
        this.ball.position.set(x, y, 0);
        this.ball.speed.set(vx, vy, 0);
        this.ball.updatePosition(elapsed);
    }
    
    // reset(ballSpeedX: number, ballSpeedY: number) {
    //     super.reset(ballSpeedX, ballSpeedY);
    //     this.serverBallEstimation.reset();
    //     this.serverBallEstimation.speed.set(ballSpeedX, ballSpeedY, 0);
    // }

    update(elapsed: number) {
        // this.ball.position.lerp(this.serverBall.position, .05);
        super.update(elapsed);
        // this.serverBallEstimation.update(elapsed);
        if (this.ball.position.x * this.playerDirection > GSettings.BALL_CONTROL_FRONTIER_X_CLIENT) {
            this.emit(GameEvent.SEND_SET_BALL,
                this.ball.position.x,
                this.ball.position.y,
                this.ball.speed.x,
                this.ball.speed.y,
                Date.now()
            );
        }
    }
}