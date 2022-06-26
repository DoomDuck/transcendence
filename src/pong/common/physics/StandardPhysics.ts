import { type Physics } from ".";
import { GSettings } from "../constants";
import { Ball, Bar } from "../entities";
import { type BallBarCollisionData, ballBarCollisionDetection } from "./collision";

export class StandardPhysics implements Physics {
    constructor(private ball: Ball, private bars: [Bar, Bar])  {}
    handleWallCollisions(ball: Ball) {
        if (ball.topY() <= GSettings.GAME_TOP) {
            // top wall
            ball.speed.y = Math.abs(ball.speed.y);
            ball.setTopY(GSettings.GAME_TOP);
        }
        else if (ball.bottomY() >= GSettings.GAME_BOTTOM) {
            // bottom wall
            ball.speed.y = -Math.abs(ball.speed.y);
            ball.setBottomY(GSettings.GAME_BOTTOM);
        }
    }

    handleBarCollision(ball: Ball, bar: Bar): boolean {
        const collision = ballBarCollisionDetection(ball, bar);
        if (collision.ignore)
            return false;
        let collisionData = collision.data as BallBarCollisionData;
        if (collisionData.horizontal || collisionData.corner) {
            // speed.x
            ball.speed.x *= -1;
            ball.speed.x += Math.sign(ball.speed.x) * GSettings.BALL_SPEEDX_INCREASE;
            if (collisionData.corner)
                ball.speed.x += Math.sign(ball.speed.x) * GSettings.BALL_SPEEDX_CORNER_BOOST;
            if (Math.abs(ball.speed.x) > GSettings.BALL_SPEEDX_MAX)
                ball.speed.x = Math.sign(ball.speed.x) * GSettings.BALL_SPEEDX_MAX;

            // speed.y
            let deltaY = ball.position.y - bar.position.y;
            if (collisionData.corner) {
                deltaY = Math.sign(deltaY) * bar.height;
                ball.speed.x += Math.sign(ball.speed.x) * GSettings.BALL_SPEEDX_CORNER_BOOST;
            }
            ball.speed.y = (deltaY / bar.height) * GSettings.BALL_SPEEDY_MAX;
        }
        else if (collisionData.vertical) {
            ball.speed.y *= -1;
        }
        return true;
    }
    
    resolve() {
        this.handleBarCollision(this.ball, this.bars[0]);
        this.handleBarCollision(this.ball, this.bars[1]);
        this.handleWallCollisions(this.ball);
    }
}