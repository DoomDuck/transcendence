import * as THREE from 'three'
import { GSettings } from './constants';


export abstract class Bar extends THREE.Mesh {
    width: number;
    height: number;
    collisionEdgeDirection: number;

    // collisionEdge: -1 for the left edge, +1 for the right edge
    constructor(collisionEdgeDirection: number) {
        const geometry = new THREE.BoxGeometry(
            GSettings.BAR_WIDTH, GSettings.BAR_HEIGHT
        );
        const material = new THREE.MeshBasicMaterial({
            color: 0xd14081,
        });
        super(geometry, material)
        this.width = GSettings.BAR_WIDTH;
        this.height = GSettings.BAR_HEIGHT;
        this.position.x = -collisionEdgeDirection * GSettings.BAR_INITIALX;
        this.position.y = GSettings.BAR_INITIALY;
        this.collisionEdgeDirection = collisionEdgeDirection;
    }

    abstract update(elapsedTime: number): void;
}
