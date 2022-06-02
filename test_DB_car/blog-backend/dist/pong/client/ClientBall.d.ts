import * as THREE from 'three';
import { Ball } from "../common/Ball";
import { PlayerID } from "../common/constants";
export declare class ClientBall extends Ball {
    mesh: THREE.Mesh;
    color: THREE.Color;
    playerId: PlayerID;
    atLimit: boolean;
    atLimitPrevious: boolean;
    atMyLimit: boolean;
    constructor(playerId: PlayerID);
    reset(x: number, y: number, vx: number, vy: number): void;
    emitGoalAtMyLimit(): void;
    update(elapsed: number): void;
}
