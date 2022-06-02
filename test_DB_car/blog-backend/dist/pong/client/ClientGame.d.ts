import * as THREE from 'three';
import { Camera } from './Camera';
import { PlayerID } from '../common/constants';
import { Game } from "../common/Game";
import { PlayersScore } from './PlayersScore';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
export declare class ClientGame extends Game {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;
    camera: Camera;
    playerId: PlayerID;
    otherPlayerId: PlayerID;
    playersScore: PlayersScore;
    constructor(playerId: PlayerID);
    loadBackground(): void;
    handleDisplayResize(): void;
    render(): void;
}
