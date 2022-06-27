import { DepthFormat, Vector3 } from "three";
import { type Physics } from ".";
import { Ball, Bar, isDeformable, type IDeformable, type IPositionSpeedSettable } from "../entities";
import { ballBarCollisionDetection, ballWallsCollisionDetection, type CollisionResult } from "./collision";

const BALL_ELASTIC_COEF = 1;
const COLLISION_DISTANCE_MIN = .01;

const _v1 = new Vector3();
let cpt = 0;
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
        for (let collision of collisions.filter(collision => collision.data.distance >= COLLISION_DISTANCE_MIN)) {
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

    rigidResolve() {
        const ball = this.ball;
        for (let collision of this.collisions) {
            if (collision.data.distance < COLLISION_DISTANCE_MIN) {
                if (cpt < 100) {
                    console.log('position', ball.position);
                    console.log('speed', ball.speed);
                    console.log('distanceVec', collision.data.distanceVec);
                    console.log('distance', collision.data.distance);
                }
                if (collision.data.distance > 0)
                    ball.position.sub(collision.data.distanceVec);
                else
                    ball.position.add(collision.data.distanceVec);
                _v1.copy(collision.data.distanceVec);
                _v1.setLength(COLLISION_DISTANCE_MIN);
                ball.position.add(_v1);
                _v1.setLength(1);
                let ballSpeedPara = _v1.dot(ball.speed);
                _v1.multiplyScalar(ballSpeedPara);
                ball.speed.sub(_v1);
                if (cpt < 100) {
                    console.log('new position', ball.position);
                    console.log('new speed', ball.speed);
                }
            }
        }
        if (this.collisions.length == 0) {
            ball.speed.setLength(this.totalSpeed);
        }

    }

    deform(deformable: IDeformable) {
        if (this.collisions.length > 0) {
            var distanceVecMin = this.collisions
                .map(collision => collision.data.distanceVec)
                .reduce((vecMin, vec) => vecMin.length() < vec.length() ? vecMin : vec);
            deformable.deform(distanceVecMin);
        }
        else {
            deformable.resetForm();
        }
    }

    resolve() {
        this.rigidResolve();
        if (isDeformable(this.ball))
            this.deform(this.ball);
    }
}
