import { Vector3 } from 'three';
import { GSettings, PlayerID, PLAYER1, PLAYER2 } from '../../common/constants'
import { Bar } from './Bar'
import { ballBarCollisionDistanceData } from './collision';
import { EventEmitter } from "events";
import { updateVectorDeltaT } from '../utils';

/**
 * Part of the Game's physical state.
 * Used directly in the server, and extended in the client (ClientBall)
 * It is responsible for handling its collisions with the bars and the walls.
 */
export class Ball {
    radius: number
    position: Vector3
    speed: Vector3
    wallCollided: boolean;
    outOfScreenAlreadyReported: boolean;

    constructor() {
        this.radius = GSettings.BALL_RADIUS;
        this.position = new Vector3();
        this.speed = new Vector3();
        this.wallCollided = false;
        this.outOfScreenAlreadyReported = false;
    }

    reset(x: number, y: number, vx: number, vy: number) {
        this.position.set(x, y, 0);
        this.speed.set(vx, vy, 0);
        this.outOfScreenAlreadyReported = false;
    }

    topY(): number {
        return this.position.y - this.radius;
    }

    bottomY(): number {
        return this.position.y + this.radius;
    }

    rightX(): number {
        return this.position.x + this.radius;
    }

    leftX(): number {
        return this.position.x - this.radius;
    }

    setTopY(y: number) {
        this.position.y = y + this.radius;
    }

    setBottomY(y: number) {
        this.position.y = y - this.radius;
    }

    gotOutOfScreen(): boolean {
        if (this.outOfScreenAlreadyReported)
            return false;
        if (this.leftX() > GSettings.GAME_RIGHT || this.rightX() < GSettings.GAME_LEFT) {
            this.outOfScreenAlreadyReported = true;
            return true;
        }
        return false;
    }

    farthestPlayerSide(): PlayerID {
        return this.position.x < 0 ? PLAYER2 : PLAYER1;
    }

    update(elapsed: number) {
        updateVectorDeltaT(this.position, this.speed, elapsed);
    }

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
        if (collision.vertical && this.wallCollided) {
            this.speed.y = 0;
            return;
        }

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
        this.wallCollided = true;
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
        else
            this.wallCollided = false;
    }

    handleCollisions(bars: [Bar, Bar]) {
        this.handleBarCollision(bars[0]);
        this.handleBarCollision(bars[1]);
        this.handleWallCollisions();
    }
}
