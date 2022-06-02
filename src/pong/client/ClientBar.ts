import * as THREE from 'three'
import { Vector3 } from 'three';
import { Bar } from '../common/Bar';
import { GSettings, PlayerID } from '../common/constants';

export class ClientBar extends Bar {
    mesh: THREE.Mesh;

    constructor(playerId: PlayerID) {
        super(playerId);
        const geometry = new THREE.BoxGeometry(
            GSettings.BAR_WIDTH, GSettings.BAR_HEIGHT
        );
        const material = new THREE.MeshBasicMaterial({
            color: 0xd14081,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.position = this.mesh.position;
        this.reset();
    }
}
