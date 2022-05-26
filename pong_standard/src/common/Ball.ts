import { Vector3 } from 'three';
import { GSettings, PlayerID, PLAYER1, PLAYER2, GameEvent } from './constants'
import { Bar } from './Bar'
import { ballBarCollision } from './collision';
import { EventEmitter } from "events";

let _v = new Vector3();

export class Ball extends EventEmitter {
    radius: number
    position: Vector3
    speed: Vector3
    wallCollided: boolean;

    constructor() {
        super();
        this.radius = GSettings.BALL_RADIUS;
        this.position = new Vector3();
        this.speed = new Vector3();
        this.reset();
        this.on(GameEvent.SET_BALL, this.onSetBall.bind(this));
        this.wallCollided = false;
    }

    reset() {
        this.position.set(0, 0, 0);
        this.speed.set(0, 0, 0);
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
        // detection
        if (this.speed.x * bar.collisionEdgeDirection >= 0)
            return;
        let collision = ballBarCollision(this, bar);
        let distance = collision.distanceVec.length();
        if (!collision.inside && distance >= this.radius)
            return;
        if (!collision.inside && collision.distanceVec.x * bar.collisionEdgeDirection <= 0)
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
            this.speed.y = bar.speed() * (1 + GSettings.BALL_COLLISION_VERTICAL_SPEEDY_BOOST);
        }
    }

    handleWallCollisions() {
        this.wallCollided = true;
        if (this.topY() < GSettings.GAME_TOP) {
            // top wall
            this.speed.y = Math.abs(this.speed.y);
            this.setTopY(GSettings.GAME_TOP);
        }
        else if (this.bottomY() > GSettings.GAME_BOTTOM) {
            // bottom wall
            this.speed.y = -Math.abs(this.speed.y);
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
        else
            this.wallCollided = false;
    }

    handleCollisions(bars: [Bar, Bar]) {
        this.handleWallCollisions();
        this.handleBarCollision(bars[0]);
        this.handleBarCollision(bars[1]);
    }

    onSetBall(x: number, y: number, vx: number, vy: number) {
        this.position.set(x, y, 0);
        this.speed.set(vx, vy, 0);
    }
}
