import { Vector3 } from 'three';
import { GSettings, PlayerID, PLAYER1, PLAYER2, GameEvent } from './constants'
import { Bar } from './Bar'
import { ballBarCollisionDistanceData } from './collision';
import { EventEmitter } from "events";

let _v = new Vector3();

export abstract class Ball extends EventEmitter {
    radius: number
    position: Vector3
    speed: Vector3
    outOfScreenAlreadyReported: boolean;

    constructor(public bars: [Bar, Bar]) {
        super();
        this.radius = GSettings.BALL_RADIUS;
        this.position = new Vector3();
        this.speed = new Vector3();
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

    updatePosition(elapsed: number) {
        _v.copy(this.speed);
        _v.multiplyScalar(elapsed / 1000);
        this.position.add(_v);
    }

    abstract update(elapsed: number): void;
}
