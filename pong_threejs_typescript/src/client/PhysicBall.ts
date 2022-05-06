import * as THREE from 'three'
import { Vector3 } from 'three';


const BALL_RADIAL_SEGMENTS = 100;
const BALL_ELASTIC_COEF = 1;
const BALL_MASS = 100;
const DELTA_T = 1000 / 60;

var _delta = new Vector3();
var _v1 = new Vector3();
var _v2 = new Vector3();
var _ux = new Vector3(1);
var _uy = new Vector3(0, 1);
var _uz = new Vector3(0, 0, 1);

// Force(x): x + 1/(x^2)
// IForce(x): x^2/2 - 1/x
// IForce x0 -> x1: x1^2/2 - 1/x1 - ( x0^2/2 - 1/x0 )
// x = v0t + x0
// IForce 0 -> t1: v0 t1^2/2 + x0 t1 - 1/(v0(v0t1 + x0))  + 1/(v0x0)


export class PhysicBall extends THREE.Mesh {
    radius: number
    // speedDirection: Vector3
    speed: Vector3
    // speedNorm: number
    // speedNormSq: number
    // INERTIA: number
    ELASIC_COEF: number
    // testCollisions: (ball: PhysicBall) => void
    // distance vectors, one per collision
    totalForces: Vector3
    mass: number
    updateCollisionDistances: (ball: PhysicBall) => Vector3[]

    constructor(radius: number, x: number, y: number, speedX: number, speedY: number,
        updateCollisionDistances: (ball: PhysicBall) => Vector3[]) {
    // constructor(radius: number, x: number, y: number, speedX: number, speedY: number, testCollisions: (ball: PhysicBall) => void ) {

        const geometry = new THREE.CylinderGeometry(
            radius, radius, 1, BALL_RADIAL_SEGMENTS,
        )
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            // wireframe: true,
        })
        super(geometry, material);
        this.rotateX(THREE.MathUtils.degToRad(90));
        this.position.x = x;
        this.position.y = y;
        this.radius = radius;
        this.speed = new Vector3(speedX, speedY);
        // this.speedDirection = new Vector3();
        // this.speedDirection.copy(speedDirection).normalize();
        // this.INERTIA = 1;
        this.ELASIC_COEF = BALL_ELASTIC_COEF;
        // this.speedNormSq = energy / this.INERTIA;
        // this.speedNorm = Math.sqrt(this.speedNormSq);
        // this.testCollisions = testCollisions;
        this.totalForces = new Vector3();
        this.mass = BALL_MASS;
        this.updateCollisionDistances = updateCollisionDistances;
    }

    // kineticEnergy() {
    //     return this.INERTIA * this.speedNormSq;
    // }

    // deformationEnergy(collisionDistance: number) {
    //     if (collisionDistance > this.radius)
    //         return 0;
    //     var dR = collisionDistance - this.radius;
    //     return (
    //         this.ELASIC_COEF
    //             * Math.pow(dR, 2)
    //             * (1 + 1 / Math.pow((1 + dR / this.radius), 2))
    //     );
    // }

    repulsionForce(dist: number) {
        if (dist > this.radius)
            return 0;
        var deltaR = this.radius - dist;
        return this.ELASIC_COEF * (deltaR / this.radius + (this.radius / dist) ** 2);
    }

    deformCollision(distanceVec: Vector3) {
        this.scale.x = 1;
        this.rotation.y = 0;

        var dist = distanceVec.length();
        var distDir = new Vector3();
        distDir.copy(distanceVec).normalize();
        if (dist < this.radius) {
            this.scale.x = dist / this.radius;
            var signY = Math.sign(distanceVec.y)
            this.rotation.y = signY * distanceVec.angleTo(_ux)
        }
    }


    updatePosition(time: number) {
        _delta.copy(this.speed);
        _delta.multiplyScalar(time / 1000);
        this.position.add(_delta);
    }

    updateDynamics(time: number) {
        for (var t = 0; t < time; t += DELTA_T) {
            var delta_t = (t + DELTA_T < time) ? DELTA_T : time - t;
            this.updateForces();
            _delta.copy(this.totalForces).divideScalar(this.mass);
            _delta.multiplyScalar(delta_t / 1000);
            this.speed.add(_delta);
            this.updatePosition(delta_t);
        }
    }

    updateForces() {
        // this.testCollisions(this);
        this.totalForces.set(0, 0, 0);
        // if (this.collisionVectors.length != 0) {
            // 1 collision for now
            // var collisionDistanceVec = this.collisionVectors[0];
            // var collisionDistance = collisionDistanceVec.length();
            // var minR = this.minimumRadius();
            // if (collisionDistance < minR) {
            //     this.rigidAdjustPosition(collisionDistanceVec, minR); // must modify collisionDistanceVec
            //     collisionDistance = minR;
            // }
            // var Ed = this.deformationEnergy(collisionDistance);

        // }
        var collisionDistanceVec = this.updateCollisionDistances(this)[0];
        var dist = collisionDistanceVec.length();
        if (dist > this.radius)
            return;
        _v1.copy(collisionDistanceVec);
        _v1.setLength(this.repulsionForce(dist));
        this.totalForces.add(_v1);
    }

    updateArrowForce(arrowForce: THREE.ArrowHelper) {
        // origin
        arrowForce.position.copy(this.position);

        // direction
        _v1.copy(this.totalForces);
        _v1.normalize();
        arrowForce.setDirection(_v1);

        // length
        arrowForce.setLength(this.totalForces.length());
    }

    // updateDynamics(time: number) {
    //     // var angle = this.speedRotationRate * time / 1000;
    //     // _q1.setFromAxisAngle(_uz, angle);
    //     // _v1.copy(this.speedDirection)
    //     // _v1.applyQuaternion(_q1)
    //     // _v1.multiplyScalar(this.kineticEnergy)
    //     // this.speed.copy(_v1)
    // }

    update(time: number) {
        this.updateDynamics(time);
        // this.speedRotationRate = Math.exp(-0.02 * time) * this.speedRotationRate;
        // this.resetCollisions();
    }
}
