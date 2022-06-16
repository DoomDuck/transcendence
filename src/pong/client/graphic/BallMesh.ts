import * as THREE from 'three';
import { GSettings } from "../../common/constants";

/**
 * Mesh of the ball using THREE.CylinderGeometry
 */
export class BallMesh extends THREE.Mesh {
    color: THREE.Color;

    constructor() {
        const geometry = new THREE.CylinderGeometry(
            GSettings.BALL_RADIUS,
            GSettings.BALL_RADIUS,
            1,
            GSettings.BALL_RADIAL_SEGMENTS,
        );
        const color = new THREE.Color(0xffffff);
        const material = new THREE.MeshBasicMaterial({
            color: color,
        });
        super(geometry, material);
        this.rotateX(THREE.MathUtils.degToRad(90));
        this.color = color
    }
}
