import { Ball, Bar, GameEvent, GameState, GSettings } from "../common";

export class ServerGameState extends GameState {
    constructor(ball: Ball, bar1: Bar, bar2: Bar) {
        super(ball, bar1, bar2);
        this.on(GameEvent.RECEIVE_SET_BALL, this.onReceiveSetBall.bind(this));
    }

    onReceiveSetBall(x: number, y: number, vx: number, vy: number, time: number) {
        let elapsed = Date.now() - time;
        this.ball.position.set(x, y, 0);
        this.ball.speed.set(vx, vy, 0);
        this.ball.updatePosition(elapsed);
    }

    update(elapsed: number) {
        super.update(elapsed);
        if (Math.abs(this.ball.position.x) <= GSettings.BALL_CONTROL_FRONTIER_X_SERVER) {
            this.emit(GameEvent.SEND_SET_BALL,
                this.ball.position.x,
                this.ball.position.y,
                this.ball.speed.x,
                this.ball.speed.y,
                Date.now()
            );
        }
        // this.stepsAccumulated += 1;
        // if (this.stepsAccumulated >= GSettings.SERVER_EMIT_INTERVAL) {
        //     this.emit(GameEvent.SEND_SET_BALL,
        //         this.state.ball.position.x,
        //         this.state.ball.position.y,
        //         this.state.ball.speed.x,
        //         this.state.ball.speed.y,
        //         Date.now()
        //     );
        //     this.stepsAccumulated = 0;
        // }
    }
}