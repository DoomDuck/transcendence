import { EventEmitter } from 'stream';
import { Vector3 } from 'three';
import { GSettings } from './constants';

export class Bar extends EventEmitter {
    width: number;
    height: number;
    collisionEdgeDirection: number;
    position: Vector3;

    /**
     * @param {number} collisionEdgeDirection - 1 for the left bar (right edge), -1 for the right bar (left edge)
     */
    constructor(collisionEdgeDirection: number) {
        super();
        this.width = GSettings.BAR_WIDTH;
        this.height = GSettings.BAR_HEIGHT;
        this.collisionEdgeDirection = collisionEdgeDirection;
        this.position = new Vector3();
        this.resetPosition();
    }

    resetPosition() {
        this.position.set(
            0,
            -this.collisionEdgeDirection * GSettings.BAR_INITIALX,
            GSettings.BAR_INITIALY,
        )
    }
}
