import { copyFile } from 'fs';
import * as THREE from 'three'
import { Vector3, Mesh, Matrix3, Quaternion } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

var _deltaPos = new Vector3();
var _v1 = new Vector3();
var _v2 = new Vector3();
var _ux = new Vector3(1);
var _uy = new Vector3(0, 1);
var _uz = new Vector3(0, 0, 1);
var _m1 = new Matrix3()
var _q1 = new Quaternion()


export class PhysicBall {
    mesh: Mesh
    position: Vector3
    radius: number
    speedDirection: Vector3
    speed: Vector3
    speedNorm: number
    speedNormSq: number
    // deformationEnergy: number
    INERTIA: number
    ELASIC_COEF: number
    testCollisions: (ball: PhysicBall) => void

    // distance vectors, one per collision
    collisionVectors: Vector3[]

    constructor(mesh: Mesh, radius: number, speedDirection: Vector3, energy: number, testCollisions: (ball: PhysicBall) => void ) {
        this.mesh = mesh;
        this.radius = radius;
        this.position = mesh.position;
        // this.deformationEnergy = 0;
        this.speed = new Vector3();
        this.speedDirection = new Vector3();
        this.speedDirection.copy(speedDirection).normalize();
        this.INERTIA = 1;
        this.ELASIC_COEF = 1;
        this.speedNormSq = energy / this.INERTIA;
        this.speedNorm = Math.sqrt(this.speedNormSq);
        this.testCollisions = testCollisions;
        this.collisionVectors = [];
    }

    kineticEnergy() {
        return this.INERTIA * this.speedNormSq;
    }

    deformationEnergy(collisionDistance: number) {
        if (collisionDistance > this.radius)
            return 0;
        var dR = collisionDistance - this.radius;
        return (
            this.ELASIC_COEF
                * Math.pow(dR, 2)
                * (1 + 1 / Math.pow((1 + dR / this.radius), 2))
        );
    }



    addCollision(collisionDistanceVec: Vector3) {
        this.collisionVectors.push(collisionDistanceVec.clone())
    }

    resetCollisions() {
        this.collisionVectors = [];
    }

    updatePosition(time: number) {
        _deltaPos.copy(this.speed);
        _deltaPos.multiplyScalar(time / 1000);
        this.position.add(_deltaPos);
    }

    updateCollisions(time: number) {
        this.testCollisions(this);
        if (this.collisionVectors.length != 0) {
            // 1 collision for now
            var collisionDistanceVec = this.collisionVectors[0];
            var collisionDistance = collisionDistanceVec.length();
            var minR = this.minimumRadius();
            if (collisionDistance < minR) {
                this.rigidAdjustPosition(collisionDistanceVec, minR); // must modify collisionDistanceVec
                collisionDistance = minR;
            }
            var Ed = this.deformationEnergy(collisionDistance);
        }
    }

    // updateSpeed(time: number) {
    //     // var angle = this.speedRotationRate * time / 1000;
    //     // _q1.setFromAxisAngle(_uz, angle);
    //     // _v1.copy(this.speedDirection)
    //     // _v1.applyQuaternion(_q1)
    //     // _v1.multiplyScalar(this.kineticEnergy)
    //     // this.speed.copy(_v1)
    // }

    update(time: number) {
        this.updatePosition(time);
        // this.speedRotationRate = Math.exp(-0.02 * time) * this.speedRotationRate;
        this.updateCollisions(time);
        this.resetCollisions();
    }
}
