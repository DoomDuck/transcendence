import { Ball, Bar, GameEvent, GameState } from "../common";
import { ServerBall } from "./ServerBall";

export class ClientGameState extends GameState {
    // serverBall: Ball;
    serverBall: ServerBall;
    constructor(ball: Ball, bar1: Bar, bar2: Bar) {
        super(ball, bar1, bar2);
        this.serverBall = new ServerBall();
        this.on(GameEvent.SET_BALL, this.onSetBall.bind(this));
    }

    onSetBall(x: number, y: number, vx: number, vy: number, time: number) {
        // let elapsed = Date.now() - time;
        this.serverBall.position.set(x, y, 0);
        // this.serverBall.speed.set(vx, vy, 0);
        // this.serverBall.updatePosition(elapsed);
        // this.serverBall.handleCollisions(this.bars);
        // this.ball.speed.set(vx, vy, 0);
    }

    update(elapsed: number) {
        this.ball.position.lerp(this.serverBall.position, .05);
        super.update(elapsed);
    }
}