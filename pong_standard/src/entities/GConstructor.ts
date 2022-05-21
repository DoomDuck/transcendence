import * as THREE from 'three'
import { Vector3 } from 'three';
import { GSettings } from '../client/constants'

// export type GConstructor<T = {}> = new (...args: any[]) => T;

class Ball {
    radius: number
    position: Vector3
    onGoal: (playerId: number) => void

    constructor(onGoal: (playerId: number) => void) {
        this.radius = GSettings.BALL_RADIUS;
        this.position = new Vector3();
        this.onGoal = onGoal;
    }
}

class GraphicBall extends Ball {
    mesh: THREE.Mesh

    constructor(onGoal: (playerId: number) => void) {
        super(onGoal);
        const geometry = new THREE.CylinderGeometry(
            GSettings.BALL_RADIUS,
            GSettings.BALL_RADIUS,
            1,
            GSettings.BALL_RADIAL_SEGMENTS,
        )
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        })
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotateX(THREE.MathUtils.degToRad(90));
        this.position = this.mesh.position;
    }
}

