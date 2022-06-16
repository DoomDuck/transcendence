import * as THREE from 'three';
// import { GSettings } from "../../../common/constants";
import { GSettings } from "@pong/common/constants";

/**
 * Mesh of the ball using THREE.CylinderGeometry
 */
export class BallMesh extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.CylinderGeometry(
            GSettings.BALL_RADIUS,
            GSettings.BALL_RADIUS,
            1,
            GSettings.BALL_RADIAL_SEGMENTS,
        );
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        });
        super(geometry, material);
        this.rotateX(THREE.MathUtils.degToRad(90));
    }

    get color(): THREE.Color {
        return this.color;
    }
}
