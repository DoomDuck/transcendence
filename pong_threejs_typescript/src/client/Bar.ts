import * as THREE from 'three'
import { Vector3 } from 'three';

export class Bar extends THREE.Mesh {
    width: number;
    height: number;
    constructor( width: number, height: number, x: number, y: number) {
        const geometry = new THREE.BoxGeometry(
            width, height
        );
        const material = new THREE.MeshBasicMaterial({
            color: 0xd14081,
        });
        super(geometry, material)
        this.width = width;
        this.height = height;
        this.position.x = x;
        this.position.y = y;
    }
}
