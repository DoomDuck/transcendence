import { Ball } from "./Ball";
import { Bar } from "./Bar";
import { ballBarCollisionDistanceData } from "./collision";
import { GSettings } from "./constants";

export class NonPhysicBall extends Ball {

    handleBarCollision(bar: Bar) {
        // detection
        if (this.speed.x * bar.collisionEdgeDirection > 0)
            return;
        let collision = ballBarCollisionDistanceData(this, bar);
        let distance = collision.distanceVec.length();
        if (!collision.inside && distance >= this.radius)
            return;
        if (!collision.inside && collision.distanceVec.x * bar.collisionEdgeDirection < 0)
            return;

        // resolution
        let posCorrection = collision.distanceVec.clone();
        if (!collision.inside)
            posCorrection.setLength(this.radius - distance);
        else
            posCorrection.setLength(this.radius + distance);
        this.position.add(posCorrection);

        // update speed
        if (collision.horizontal || collision.corner) {
            // speed.x
            this.speed.x *= -1;
            this.speed.x += Math.sign(this.speed.x) * GSettings.BALL_SPEEDX_INCREASE;
            if (collision.corner)
                this.speed.x += Math.sign(this.speed.x) * GSettings.BALL_SPEEDX_CORNER_BOOST;
            if (Math.abs(this.speed.x) > GSettings.BALL_SPEEDX_MAX)
                this.speed.x = Math.sign(this.speed.x) * GSettings.BALL_SPEEDX_MAX;

            // speed.y
            let deltaY = this.position.y - bar.position.y;
            if (collision.corner) {
                deltaY = Math.sign(deltaY) * bar.height;
                this.speed.x += Math.sign(this.speed.x) * GSettings.BALL_SPEEDX_CORNER_BOOST;
            }
            this.speed.y = (deltaY / bar.height) * GSettings.BALL_SPEEDY_MAX;
        }
        else if (collision.vertical) {
            this.speed.y *= -1;
        }
    }

    handleWallCollisions() {
        if (this.topY() <= GSettings.GAME_TOP) {
            // top wall
            this.speed.y = Math.abs(this.speed.y);
            this.setTopY(GSettings.GAME_TOP);
        }
        else if (this.bottomY() >= GSettings.GAME_BOTTOM) {
            // bottom wall
            this.speed.y = -Math.abs(this.speed.y);
            this.setBottomY(GSettings.GAME_BOTTOM);
        }
    }

    handleCollisions() {
        this.handleBarCollision(this.bars[0]);
        this.handleBarCollision(this.bars[1]);
        this.handleWallCollisions();
    }

    update(elapsed: number) {
        this.updatePosition(elapsed);
        this.handleCollisions();
    }
}
