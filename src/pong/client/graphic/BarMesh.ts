import * as THREE from 'three';
import { GSettings } from '../../common/constants';

/**
 * Purely graphic component of ClientBar
 */
export class BarMesh extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.BoxGeometry(
            GSettings.BAR_WIDTH, GSettings.BAR_HEIGHT
        );
        const material = new THREE.MeshBasicMaterial({
            color: 0xd14081,
        });
        super(geometry, material);
    }
}
