import * as THREE from 'three'
import { Vector3 } from 'three';


const BALL_RADIAL_SEGMENTS = 100;
const BALL_ELASTIC_COEF = 1;
const BALL_MASS = 500;
const DELTA_T = 1000 / 60;

var _delta = new Vector3();
var _v1 = new Vector3();
var _v2 = new Vector3();
var _ux = new Vector3(1);
var _uy = new Vector3(0, 1);
var _uz = new Vector3(0, 0, 1);


export class PhysicBall extends THREE.Mesh {
    radius: number
    speed: Vector3
    ELASIC_COEF: number
    totalForces: Vector3
    mass: number
    energy: number
    updateCollisionDistances: (ball: PhysicBall) => Vector3[]

    constructor(radius: number, x: number, y: number, speedX: number, speedY: number,
        updateCollisionDistances: (ball: PhysicBall) => Vector3[]) {

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
        this.ELASIC_COEF = BALL_ELASTIC_COEF;
        this.totalForces = new Vector3();
        this.mass = BALL_MASS;
        this.updateCollisionDistances = updateCollisionDistances;
        this.energy = this.mass * this.speed.lengthSq() / 2;
    }

    repulsionForce(dist: number) {
        if (dist > this.radius)
            return 0;
        var deltaR = this.radius - dist;
        return this.ELASIC_COEF * (deltaR / this.radius + (this.radius / dist) ** 2);
    }

	repulsionEnergyOne(dist: number) {
        if (dist > this.radius)
            return 0;
        return this.ELASIC_COEF * (dist - dist ** 2 / this.radius / 2 - this.radius ** 2 / dist + this.radius)
	}

    repulsionEnergy() {
        return (this.updateCollisionDistances(this)
            .map((vec: Vector3) => this.repulsionEnergyOne(vec.length()))
            .reduce((x, y) => x + y, 0)
        );
    }

    deformCollision(distanceVectors: Vector3[]) {
        this.scale.x = 1;
        this.rotation.y = 0;

        if (distanceVectors.length == 0)
            return;
        var distanceVec = distanceVectors.reduce((vecMin, vec) => vecMin.length() < vec.length() ? vecMin : vec);

        var dist = distanceVec.length();
        if (dist < this.radius) {
            var distDir = new Vector3();
            distDir.copy(distanceVec).normalize();
            this.scale.x = dist / this.radius;
            var signY = Math.sign(distanceVec.y)
            this.rotation.y = signY * distanceVec.angleTo(_ux)
        }
    }

    correctSpeedBasedOnEnergy() {
        var rE = this.repulsionEnergy();
        if (rE > this.energy)
            this.speed.set(0, 0, 0)
        else if (rE > 0.01) {
            _v1.copy(this.totalForces);
            _v1.setLength(1);
            var speedOrthoNorm = this.speed.dot(_v1)
            _v1.multiplyScalar(speedOrthoNorm); // speedOrtho
            _v2.copy(this.speed);
            _v2.sub(_v1); //speedPara
            var speedParaNormSq = _v2.lengthSq()
            var newSpeedOrthoEnergy = Math.max(this.energy - speedParaNormSq * this.mass / 2 - rE, 0)
            var newSpeedOrthoNorm = Math.sqrt(2 * newSpeedOrthoEnergy / this.mass);
            _v1.setLength(1);
            _v1.multiplyScalar(newSpeedOrthoNorm);
            this.speed.copy(_v1).add(_v2)
        }
        else {
            this.speed.setLength(Math.sqrt(2 * this.energy / this.mass))
        }
    }

    updatePosition(elapsedTime: number) {
        _delta.copy(this.speed);
        _delta.multiplyScalar(elapsedTime / 1000);
        this.position.add(_delta);
    }

    updateSpeed(elapsedTime: number) {
        _delta.copy(this.totalForces).divideScalar(this.mass);
        _delta.multiplyScalar(elapsedTime / 1000);
        this.speed.add(_delta);
    }

    updateDynamics(elapsedTime: number) {
        for (var t = 0; t < elapsedTime; t += DELTA_T) {
            var dt = (t + DELTA_T < elapsedTime) ? DELTA_T : elapsedTime - t;
            if (this.updateForces())
                this.updateSpeed(dt);
            this.updatePosition(dt);
        }
        this.correctSpeedBasedOnEnergy()
    }

    updateForces(): boolean {
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
        var collisionDistanceVectors = this.updateCollisionDistances(this);
        // console.log(collisionDistanceVectors)
        if (collisionDistanceVectors.length == 0)
            return false;
        for (var collisionDistanceVec of collisionDistanceVectors) {
            var dist = collisionDistanceVec.length();
            // if (dist > this.radius)
            //     return false;
            _v1.copy(collisionDistanceVec);
            _v1.setLength(this.repulsionForce(dist));
            this.totalForces.add(_v1);
        }
        return true;
    }


    update(elapsedTime: number) {
        this.updateDynamics(elapsedTime);
        this.deformCollision(this.updateCollisionDistances(this));
        // console.log(this.position)
        // this.speedRotationRate = Math.exp(-0.02 * time) * this.speedRotationRate;
    }
}
