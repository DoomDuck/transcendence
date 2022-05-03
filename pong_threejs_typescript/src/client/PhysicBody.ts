import * as THREE from 'three'
import { Vector3, Mesh, Matrix3, Quaternion } from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

var _v1 = new Vector3()
var _ux = new Vector3(1);
var _uy = new Vector3(0, 1);
var _uz = new Vector3(0, 0, 1);
var _m1 = new Matrix3()
var _q1 = new Quaternion()

export class PhysicBody {
    mesh: Mesh
    position: Vector3
    kineticEnergy: number
    speedDirection: Vector3
    speed: Vector3
    acceleration: Vector3
    // rotationSpeed: Vector3
    speedRotationRate: number
    totalForce: Vector3
    // physics: boolean

    constructor(mesh: Mesh, speed: Vector3) {
        this.mesh = mesh;
        this.position = mesh.position;
        this.acceleration = new Vector3(0, 0);
        // this.rotationSpeed = new Vector3(0, 0, 1);
        this.speedRotationRate = 10;
        this.speed = speed;
        this.kineticEnergy = speed.length();
        this.speedDirection = new Vector3();
        this.speedDirection.copy(speed).normalize();
        this.totalForce = new Vector3(0, 0);
        // this.physics = true;
    }

    // startCollisionTween() {
    //     const elasticCoef = 1;
    //     const penetrationDist = this.speed.x / elasticCoef;
    //     const collisionHalfTime = Math.PI / (4 * elasticCoef);
    //     const direction = Math.sign(this.speed.x);
    //     var tween1 = new TWEEN.Tween(this.position);
    //     tween1.to({
    //         x: this.position.x + direction * penetrationDist,
    //         y: this.position.y + collisionHalfTime * this.speed.y / 1000,
    //     }, collisionHalfTime).easing(TWEEN.Easing.Circular.Out);
    //     var tween2 = new TWEEN.Tween(this.position);
    //     tween2.to({
    //         x: this.position.x,
    //         y: this.position.y + 2 * collisionHalfTime * this.speed.y / 1000,
    //     }, collisionHalfTime).easing(TWEEN.Easing.Circular.In);
    //     tween1.chain(tween2);
    //     tween1.onStart(() => {
    //         // this.physics = false;
    //     });
    //     const previousSpeedX = this.speed.x;
    //     tween2.onComplete(() => {
    //         // this.physics = true;
    //         this.speed.x = -previousSpeedX;
    //     })
    //     tween1.start();
    // }

    updatePosition(time: number) {
        _v1.copy(this.speed);
        _v1.multiplyScalar(time / 1000);
        this.position.add(_v1);
    }

    updateSpeed(time: number) {
        // _v1.crossVectors(this.rotationSpeed, this.speed);
        // _v1.multiplyScalar(.01);
        // this.acceleration.copy(_v1);
        var angle = this.speedRotationRate * time / 1000; 
        _q1.setFromAxisAngle(_uz, angle);
        _v1.copy(this.speedDirection)
        _v1.applyQuaternion(_q1)
        _v1.multiplyScalar(this.kineticEnergy)
        this.speed.copy(_v1)

        // this.speed.applyQuaternion(_q1)
        // this.speed.x += time * this.acceleration.x / 1000;
        // this.speed.y += time * this.acceleration.y / 1000;
    }

    update(time: number) {
        // this.position.x += time * this.speed.x / 1000;
        // this.position.y += time * this.speed.y / 1000;
        this.updatePosition(time);
        this.updateSpeed(time);
        this.speedRotationRate = Math.exp(-0.02 * time) * this.speedRotationRate;
        // if (ballBarCollision(ball, bar.position)) {
        //     ball.startCollisionTween();
        // }
    }
}