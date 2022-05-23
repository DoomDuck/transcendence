import * as THREE from 'three'
import { Vector3 } from 'three';
import { Ball } from './Ball';
import { GSettings } from '../common/constants';
import { Bar } from 'Bar';

let _delta = new Vector3();

export class LocalBall extends Ball {
    speed: Vector3

    constructor(onGoal: (playerId: number) => void) {
        super(onGoal);
        this.speed = new Vector3();
    }

    topY(): number {
        return this.position.y - this.radius;
    }

    bottomY(): number {
        return this.position.y + this.radius;
    }

    setTopY(y: number) {
        this.position.y = y + this.radius;
    }

    setBottomY(y: number) {
        this.position.y = y - this.radius;
    }

    updatePosition(elapsedTime: number) {
        _delta.copy(this.speed);
        _delta.multiplyScalar(elapsedTime / 1000);
        this.position.add(_delta);
    }

    /**
     * Return whether the ball is inside and the distance from the
     * bar to the ball (edges of the rectangle to center)
     * @param {Bar} bar
     * @returns {[boolean, Vector3]}
     */
    //
    barCollisionDistance(bar: Bar): [boolean, Vector3] {
        let distanceToCenter = new Vector3();
        let isInside = false;

        distanceToCenter.copy(this.position);
        distanceToCenter.sub(bar.position);
        let signX = Math.sign(distanceToCenter.x);
        let signY = Math.sign(distanceToCenter.y);
        let x = Math.abs(distanceToCenter.x) - bar.width / 2;
        let y = Math.abs(distanceToCenter.y) - bar.height / 2;
        distanceToCenter.x -= signX * (bar.width / 2)
        distanceToCenter.y -= signY * (bar.height / 2)
        // distanceToBorder: bar to ball-border
        if (x > 0 && y < 0) {
            // lateral face
            distanceToCenter.y = 0;
        }
        else if (x < 0 && y > 0) {
            // upper face
            distanceToCenter.x = 0;
        }
        else if (x > 0 && y > 0) {
            // diagonal
            // TODO: Speed boost
        }
        else  {
            isInside = true;
        }

        return [isInside, distanceToCenter];
    }

    handleBarCollision(bar: Bar) {
        //detection
        if (this.speed.x * bar.collisionEdgeDirection >= 0)
            return;
        let [isInside, distanceVecToCenter] = this.barCollisionDistance(bar);
        let distance = distanceVecToCenter.length();
        if (distance >= this.radius)
            return;
        if (distanceVecToCenter.x * bar.collisionEdgeDirection <= 0)
            return;

        //resolution
        let posCorrection = distanceVecToCenter.clone();
        posCorrection.setLength(this.radius - distance);
        this.position.add(posCorrection);
        this.changeSpeedBarCollision(bar);
    }

    changeSpeedBarCollision(bar: Bar) {
        // speed.x
        this.speed.x *= -1;
        this.speed.x += Math.sign(this.speed.x) * GSettings.BALL_SPEEDX_INCREASE;
        if (Math.abs(this.speed.x) > GSettings.BALL_SPEEDX_MAX)
            this.speed.x = Math.sign(this.speed.x) * GSettings.BALL_SPEEDX_MAX;

        // speed.y
        let deltaY = this.position.y - bar.position.y;
        this.speed.y = (deltaY / bar.height) * GSettings.BALL_SPEEDY_MAX;
    }

    handleWallCollisions() {
        if (this.topY() < GSettings.GAME_TOP) {
            // top wall
            this.speed.y *= -1;
            this.setTopY(GSettings.GAME_TOP);
        }
        else if (this.bottomY() > GSettings.GAME_BOTTOM) {
            // bottom wall
            this.speed.y *= -1;
            this.setBottomY(GSettings.GAME_BOTTOM);
        }
        else if (this.position.x < GSettings.GAME_LEFT) {
            // goal to the left, player 2 scored
            this.onGoal(1);
        }
        else if (this.position.x > GSettings.GAME_RIGHT) {
            // goal to the right, player 1 scored
            this.onGoal(0);
        }
    }

    update(elapsedTime: number) {
        this.updatePosition(elapsedTime);
    }
}
