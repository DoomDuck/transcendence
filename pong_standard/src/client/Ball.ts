import * as THREE from 'three'
import { GSettings } from 'common/constants';

export abstract class Ball extends THREE.Mesh {
    radius: number
    onGoal: (playerId: number) => void

    constructor(onGoal: (playerId: number) => void) {
        const geometry = new THREE.CylinderGeometry(
            GSettings.BALL_RADIUS,
            GSettings.BALL_RADIUS,
            1,
            GSettings.BALL_RADIAL_SEGMENTS,
        )
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        })
        super(geometry, material);
        this.radius = GSettings.BALL_RADIUS;
        this.onGoal = onGoal;
        this.rotateX(THREE.MathUtils.degToRad(90));
        this.position.x = 0;
        this.position.y = 0;
    }

    abstract update(elapsedTime: number): void;
}
