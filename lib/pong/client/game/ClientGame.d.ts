import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { Camera } from "../graphic";
import { PlayerID } from "../../common/constants";
import { Game } from "../../common/game";
export declare class ClientGame extends Game {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;
    camera: Camera;
    playerId: PlayerID;
    otherPlayerId: PlayerID;
    container: HTMLDivElement;
    constructor(playerId: PlayerID, container: HTMLDivElement);
    loadBackground(): void;
    handleDisplayResize(): void;
    render(): void;
}
