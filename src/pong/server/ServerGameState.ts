import { Ball, Bar, GameEvent, GameState } from "../common";

export class ServerGameState extends GameState {
    constructor(ball: Ball, bar1: Bar, bar2: Bar) {
        super(ball, bar1, bar2);
    }

    update(elapsed: number) {
        this.ball.update(elapsed);
        this.bars[0].update(elapsed);
        this.bars[1].update(elapsed);
        this.ball.handleCollisions(this.bars);
        this.emit(GameEvent.SEND_SET_BALL,
            this.ball.position.x,
            this.ball.position.y,
            this.ball.speed.x,
            this.ball.speed.y,
            Date.now()
        );
        if (this.ball.gotOutOfScreen()) {
            this.emit(GameEvent.GOAL, this.ball.farthestPlayerSide());
        }
    }
}
