import { Vector3 } from 'three';
import { GSettings, PlayerID, PLAYER1, PLAYER2, GameEvent } from './constants'
import { Bar } from './Bar'
import { ballBarCollisionDistance } from './collision';
import { EventEmitter } from 'events';

let _v = new Vector3();

export class Ball extends EventEmitter {
    radius: number
    position: Vector3
    speed: Vector3

    constructor() {
        super();
        this.radius = GSettings.BALL_RADIUS;
        this.position = new Vector3();
        this.speed = new Vector3();
        this.resetPosition();
    }

    resetPosition() {
        this.position.set(0, 0, 0);
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
        _v.copy(this.speed);
        _v.multiplyScalar(elapsedTime / 1000);
        this.position.add(_v);
    }

    update(elapsedTime: number) {
        this.updatePosition(elapsedTime);
    }

    handleBarCollision(bar: Bar) {
        //detection
        if (this.speed.x * bar.collisionEdgeDirection >= 0)
            return;
        let [isInside, distanceVecToCenter] = ballBarCollisionDistance(this, bar);
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
            this.emit(GameEvent.GOAL, PLAYER2);
        }
        else if (this.position.x > GSettings.GAME_RIGHT) {
            // goal to the right, player 1 scored
            this.emit(GameEvent.GOAL, PLAYER1);
        }
    }

    handleCollisions(bars: [Bar, Bar]) {
        this.handleBarCollision(bars[0]);
        this.handleBarCollision(bars[1]);
        this.handleWallCollisions();
    }
}
