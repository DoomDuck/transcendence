import * as THREE from 'three';
import { Bar } from '../common/Bar';
import { PlayerID } from '../common/constants';
export declare class ClientBar extends Bar {
    mesh: THREE.Mesh;
    constructor(playerId: PlayerID);
}
