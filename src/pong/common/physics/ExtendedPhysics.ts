import { Vector3 } from "three";
import { type Physics } from ".";
import { Ball, Bar, type IPositionSpeedSettable } from "../entities";
import { ballBarCollisionDetection, ballWallsCollisionDetection, type CollisionResult } from "./collision";

const BALL_ELASTIC_COEF = 1;
const COLLISION_DISTANCE_MIN = .01;

const _v1 = new Vector3();
export class ExtendedPhysics implements Physics, IPositionSpeedSettable {
    totalForces: Vector3;
    totalSpeed: number;
    collisions: CollisionResult[];

    constructor(private ball: Ball, private bars: [Bar, Bar]) {
        this.totalForces = new Vector3();
        this.totalSpeed = 0;
        this.collisions = [];
    }
    
    setPositionSpeed(x: number, y: number, vx: number, vy: number) {
        this.totalSpeed = Math.sqrt(vx ** 2 + vy ** 2);
    }

    repulsionForce(dist: number) {
        const ball = this.ball;
        if (dist > ball.radius)
            return 0;
        let deltaR = ball.radius - dist;
        return BALL_ELASTIC_COEF * (deltaR / ball.radius + (ball.radius / dist) ** 2);
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
        const ball = this.ball;
        _v1.copy(this.totalForces);
        _v1.multiplyScalar(elapsedTime / 1000);
        ball.speed.add(_v1);
    }

    allCollisions(): CollisionResult[] {
        return [
            ballBarCollisionDetection(this.ball, this.bars[0]),
            ballBarCollisionDetection(this.ball, this.bars[1]),
            ...ballWallsCollisionDetection(this.ball),
        ].filter((collsision) => !collsision.ignore);
    }

    apply(elapsed: number) {
        this.collisions = this.allCollisions();
        if (this.collisions.length > 0) {
            this.updateForces(this.collisions);
            this.updateSpeed(elapsed);
        }
    }

    resolve() {
        const ball = this.ball;
        for (let collision of this.collisions) {
            if (collision.data.distance < COLLISION_DISTANCE_MIN) {
                ball.position.sub(collision.data.distanceVec);
                collision.data.distanceVec.setLength(COLLISION_DISTANCE_MIN);
                ball.position.add(collision.data.distanceVec);
            }
        }
        if (this.collisions.length == 0) {
            ball.speed.setLength(this.totalSpeed);
        }
    }
}