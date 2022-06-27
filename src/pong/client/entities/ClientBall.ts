import { Ball, Bar, type IDeformable } from "../../common/entities";
import { GSettings, PlayerID } from "../../common/constants";
// import { BallMesh } from '../graphic';
import { Vector3 } from "three";
import { updateVectorDeltaT } from "../../common/utils";

const _ux = new Vector3(1, 0, 0);

/**
 * The ball part of a game instance on the client side (ClientGame).
 * Adds display capability to Ball, as well as dynamic color.
 * Also smoothes the position of the server's ball (which is junky due to socket transmission).
 */
export class ClientBall extends Ball implements IDeformable {
    // mesh: BallMesh;
    playerId: PlayerID;
    serverPosition: Vector3;
    serverSpeed: Vector3;

    constructor(playerId: PlayerID) {
        super();
        // this.mesh = new BallMesh();
        this.playerId = playerId;
        this.serverPosition = new Vector3();
        this.serverSpeed = new Vector3();
    }

    setPositionSpeed(x: number, y: number, vx: number, vy: number): void {
        super.setPositionSpeed(x, y, vx, vy);
        this.serverPosition.set(x, y, 0);
        this.serverSpeed.set(vx, vy, 0);
    }

    reset() {
        // this.mesh.color.set(0xffffff);
    }

    handleReceiveSetBall(x: number, y: number, vx: number, vy: number, time: number) {
        this.serverPosition.set(x, y, 0);
        this.serverSpeed.set(vx, vy, 0);
        let elapsed = Date.now() - time;
        updateVectorDeltaT(this.serverPosition, this.serverSpeed, elapsed);
    }

    update(elapsed: number) {
        super.update(elapsed);
        const dist = this.position.distanceTo(this.serverPosition)
        if (dist > GSettings.BALL_CLIENT_SERVER_LERP_DIST) {
            this.position.lerp(this.serverPosition, GSettings.BALL_CLIENT_SERVER_LERP_FACTOR);
            this.speed.copy(this.serverSpeed);
        }
        this.changeColorAtLimit();
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
            // this.mesh.color.setRGB(1, 1 - surfaceRatio, 1 - surfaceRatio);
        }
    }

    resetForm() {
        // this.mesh.scale.x = 1;
        // this.mesh.rotation.y = 0;
    }

    deform(distanceVectorMin: Vector3) {
        // var dist = distanceVectorMin.length();
        // var distDir = new Vector3();
        // distDir.copy(distanceVectorMin).normalize();
        // this.mesh.scale.x = dist / this.radius;
        // var signY = Math.sign(distanceVectorMin.y);
        // this.mesh.rotation.y = signY * distanceVectorMin.angleTo(_ux);
    }
}
