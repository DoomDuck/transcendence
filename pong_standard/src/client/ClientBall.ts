import * as THREE from 'three'
import { MeshBasicMaterial } from 'three';
import { Ball } from "../common/Ball";
import { GameEvent, GSettings, PLAYER1, PLAYER2, PlayerID } from "../common/constants";

export class ClientBall extends Ball {
    mesh: THREE.Mesh;
    color: THREE.Color;
    playerId: PlayerID;
    atLimit: boolean;
    atLimitPrevious: boolean;
    atMyLimit: boolean;

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
        this.atLimit = false;
        this.atLimitPrevious = false;
        this.atMyLimit = false;
    }

    // get color(): THREE.Color {
    //     return (this.mesh.material as THREE.MeshBasicMaterial).color;
    // }

    reset(x: number, y: number, vx: number, vy: number) {
        super.reset(x, y, vx, vy);
        this.color.set(0xffffff);
        this.atLimit = false;
        this.atLimitPrevious = false;
        this.atMyLimit = false;
        console.log('clientball reset called');
    }

    emitGoalAtMyLimit() {
        this.emit(GameEvent.SEND_GOAL, this.playerId == PLAYER1 ? PLAYER2 : PLAYER1);
    }

    update(elapsed: number) {
        super.update(elapsed);
        // console.log(`at my limit: ${this.atMyLimit}`)
        this.atLimitPrevious = this.atLimit;
        let dx = 0;
        if (this.rightX() > GSettings.GAME_RIGHT) {
            this.atLimit = true;
            dx = this.rightX() - GSettings.GAME_RIGHT;
        }
        else if (this.leftX() < GSettings.GAME_LEFT) {
            this.atLimit = true;
            dx = GSettings.GAME_LEFT - this.leftX();
        }
        if (this.atLimit && !this.atLimitPrevious) {
            let speedRatio = GSettings.BALL_SPEED_AT_LIMIT / Math.abs(this.speed.x);
            this.speed.multiplyScalar(speedRatio);
        }
        if (this.atLimit) {
            let k = Math.max(-1, 1 - dx / this.radius);
            // computing ratio of the surface visible
            let surfaceRatio = Math.acos(k) - k * Math.sqrt(1 - k ** 2);
            this.color.setRGB(1, 1 - surfaceRatio, 1 - surfaceRatio);
        }
        if (!this.atMyLimit && (
               (this.leftX() > GSettings.GAME_RIGHT && this.playerId == PLAYER2)
            || (this.rightX() < GSettings.GAME_LEFT && this.playerId == PLAYER1))) {
            this.atMyLimit = true;
            this.emitGoalAtMyLimit();
        }
    }
}
