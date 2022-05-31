import * as THREE from 'three'
import { Ball } from "../common/Ball";
import { GSettings } from "../common/constants";

export class ServerBall extends Ball {
    mesh: THREE.Mesh

    constructor() {
        super();
        const geometry = new THREE.CylinderGeometry(
            GSettings.BALL_RADIUS,
            GSettings.BALL_RADIUS,
            1,
            GSettings.BALL_RADIAL_SEGMENTS,
        )
        const material = new THREE.MeshBasicMaterial({
            color: 0x10b7b7,
        })
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotateX(THREE.MathUtils.degToRad(90));
        this.position = this.mesh.position;
    }
}
