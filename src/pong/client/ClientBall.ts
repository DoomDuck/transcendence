import * as THREE from 'three'
import { MeshBasicMaterial } from 'three';
import { Ball } from "../common/Ball";
import { GameEvent, GSettings, PLAYER1, PLAYER2, PlayerID } from "../common/constants";

export class ClientBall extends Ball {
    mesh: THREE.Mesh;
    color: THREE.Color;
    playerId: PlayerID;

    constructor(playerId: PlayerID) {
        super();
        const geometry = new THREE.CylinderGeometry(
            GSettings.BALL_RADIUS,
            GSettings.BALL_RADIUS,
            1,
            GSettings.BALL_RADIAL_SEGMENTS,
        )
        // this.color = new THREE.Color(0xffffff);
        const material = new THREE.MeshBasicMaterial({
            // color: this.color,
            color: 0xffffff,
        })
        this.color = material.color;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotateX(THREE.MathUtils.degToRad(90));
        this.position = this.mesh.position;
        this.playerId = playerId;
    }

    reset(x: number, y: number, vx: number, vy: number) {
        super.reset(x, y, vx, vy);
        this.color.set(0xffffff);
    }

    changeColorAtLimit() {
        let dx = 0;
        let atLimit = false;
        if (this.rightX() > GSettings.GAME_RIGHT) {
            atLimit = true;
            dx = this.rightX() - GSettings.GAME_RIGHT;
        }
        else if (this.leftX() < GSettings.GAME_LEFT) {
            atLimit = true;
            dx = GSettings.GAME_LEFT - this.leftX();
        }
        if (atLimit) {
            let k = Math.max(-1, 1 - dx / this.radius);
            // ratio of the surface visible
            let surfaceRatio = Math.acos(k) - k * Math.sqrt(1 - k ** 2);
            this.color.setRGB(1, 1 - surfaceRatio, 1 - surfaceRatio);
        }
    }

    update(elapsed: number) {
        super.update(elapsed);
        this.changeColorAtLimit();
    }
}
