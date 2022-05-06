import * as THREE from 'three'
import { Vector3 } from 'three';
import { PhysicBall } from './PhysicBall';

const ARROW_FORCE_LENGTH_MULT = 100;
var _v1 = new Vector3();

export function updateArrowDist(distanceVec: Vector3, closestPoint: Vector3, arrowDist: THREE.ArrowHelper) {
    // origin
    arrowDist.position.copy(closestPoint);

    // direction
    var dist = distanceVec.length();
    _v1.copy(distanceVec);
    _v1.normalize();
    arrowDist.setDirection(_v1);

    // length
    arrowDist.setLength(dist);
}


export function updateArrowForce(ball: PhysicBall, arrowForce: THREE.ArrowHelper) {
    ball.updateForces();

    // origin
    arrowForce.position.copy(ball.position);

    // direction
    _v1.copy(ball.totalForces);
    _v1.normalize();
    arrowForce.setDirection(_v1);

    // length
    arrowForce.setLength(ball.totalForces.length() * ARROW_FORCE_LENGTH_MULT);
}
