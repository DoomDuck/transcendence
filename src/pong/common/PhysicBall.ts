import { Vector3 } from 'three';
import { Ball } from './Ball';
import { Bar } from './Bar';
import { ballBarCollisionDetection, ballWallsCollisionDetection, type CollisionResult } from './collision';
import { GSettings, PLAYER1, PLAYER2, PlayerID } from './constants';

const BALL_ELASTIC_COEF = 1;
const COLLISION_DISTANCE_MIN = .01

let _delta = new Vector3();
let _v1 = new Vector3();
let _v2 = new Vector3();
let _ux = new Vector3(1);
let _uy = new Vector3(0, 1);
let _uz = new Vector3(0, 0, 1);

export class PhysicBall extends Ball {
    totalForces: Vector3;
    totalSpeed: number;

    constructor(bars: [Bar, Bar]) {
        super(bars);
        this.totalForces = new Vector3();
        this.totalSpeed = 0;
    }

    reset(x: number, y: number, vx: number, vy: number): void {
        super.reset(x, y, vx, vy);
        this.totalSpeed = Math.sqrt(vx ** 2 + vy ** 2);
    }


    repulsionForce(dist: number) {
        if (dist > this.radius)
            return 0;
        let deltaR = this.radius - dist;
        return BALL_ELASTIC_COEF * (deltaR / this.radius + (this.radius / dist) ** 2);
    }

    updateForces(collisions: CollisionResult[]) {
        this.totalForces.set(0, 0, 0);
        for (let collision of collisions) {
            _v1.copy(collision.data.distanceVec);
            _v1.setLength(this.repulsionForce(collision.data.distance));
            this.totalForces.add(_v1);
        }
    }

    updateSpeed(elapsedTime: number) {
        _delta.copy(this.totalForces);
        _delta.multiplyScalar(elapsedTime / 1000);
        this.speed.add(_delta);
    }

    allCollisions(bars: [Bar, Bar]): CollisionResult[] {
        return [
            ballBarCollisionDetection(this, bars[0]),
            ballBarCollisionDetection(this, bars[1]),
            ...ballWallsCollisionDetection(this),
        ].filter((collsision) => !collsision.ignore);
    }

    update(elapsedTime: number) {
        let collisions = this.allCollisions(this.bars);
        if (collisions.length > 0) {
            this.updateForces(collisions);
            this.updateSpeed(elapsedTime);
        }
        this.updatePosition(elapsedTime);
        for (let collision of collisions) {
            if (collision.data.distance < COLLISION_DISTANCE_MIN) {
                this.position.sub(collision.data.distanceVec);
                collision.data.distanceVec.setLength(COLLISION_DISTANCE_MIN);
                this.position.add(collision.data.distanceVec);
            }
        }
        if (collisions.length == 0) {
            this.speed.setLength(this.totalSpeed);
        }
    }
}
