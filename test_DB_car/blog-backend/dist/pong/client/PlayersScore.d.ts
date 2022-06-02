import * as THREE from 'three';
import { Vector3 } from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { PlayerID } from '../common';
declare class Score {
    value: number;
    div: HTMLDivElement;
    threeObject: CSS2DObject;
    position: Vector3;
    constructor(playerId: PlayerID);
    increment(): void;
    reset(): void;
}
export declare class PlayersScore {
    player1Score: Score;
    player2Score: Score;
    group: THREE.Group;
    constructor();
    handleGoal(playerId: PlayerID): void;
    reset(): void;
}
export {};
