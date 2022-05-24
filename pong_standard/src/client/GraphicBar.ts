import * as THREE from 'three'
import { Bar } from '../common/Bar';
import { GSettings } from '../common/constants';

export class GraphicBar extends Bar {
    mesh: THREE.Mesh;

    constructor(collisionEdgeDirection: number) {
        super(collisionEdgeDirection);
        const geometry = new THREE.BoxGeometry(
            GSettings.BAR_WIDTH, GSettings.BAR_HEIGHT
        );
        const material = new THREE.MeshBasicMaterial({
            color: 0xd14081,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.position = this.mesh.position;
        console.log(`position: ${this.position.x}, ${this.position.y}`)
    }
}
