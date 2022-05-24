import { EventEmitter } from 'events';
import { Vector3 } from 'three';
import { GSettings, LEFT, PLAYER1, PlayerID, RIGHT } from './constants';

export class Bar extends EventEmitter {
    width: number;
    height: number;
    collisionEdgeDirection: number;
    position: Vector3;

    constructor(playerId: PlayerID) {
        super();
        this.width = GSettings.BAR_WIDTH;
        this.height = GSettings.BAR_HEIGHT;
        this.collisionEdgeDirection = (playerId == PLAYER1) ? RIGHT : LEFT;
        this.position = new Vector3();
    }

    resetPosition() {
        this.position.set(
            0,
            -this.collisionEdgeDirection * GSettings.BAR_INITIALX,
            GSettings.BAR_INITIALY,
        )
    }
}
