import { Ball, Bar } from "../../common/entities";
import { GSettings, PlayerID } from "../../common/constants";
import { BallMesh } from '../graphic';
import { Vector3 } from "three";
import { updateVectorDeltaT } from "../../common/utils";
import { NonPhysicBall } from "../../common/entities/NonPhysicBall";

/**
 * The ball part of a game instance on the client side (ClientGame).
 * Adds display capability to Ball, as well as dynamic color.
 * Also smoothes the position of the server's ball (which is junky due to socket transmission).
 */
export class ClientBall extends NonPhysicBall {
    mesh: BallMesh;
    playerId: PlayerID;
    serverPosition: Vector3;
    serverSpeed: Vector3;

    constructor(playerId: PlayerID) {
        super();
        this.mesh = new BallMesh();
        this.position = this.mesh.position;
        this.playerId = playerId;
        this.serverPosition = new Vector3();
        this.serverSpeed = new Vector3();
    }

    reset(x: number, y: number, vx: number, vy: number) {
        super.reset(x, y, vx, vy);
        this.mesh.color.set(0xffffff);
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
            this.mesh.color.setRGB(1, 1 - surfaceRatio, 1 - surfaceRatio);
        }
    }

    handleReceiveSetBall(x: number, y: number, vx: number, vy: number, time: number) {
        let elapsed = Date.now() - time;
        this.serverPosition.set(x, y, 0);
        this.serverSpeed.set(vx, vy, 0);
        updateVectorDeltaT(this.serverPosition, this.serverSpeed, elapsed);
    }

    update(elapsed: number, bars: [Bar, Bar]) {
        super.update(elapsed, bars);
        const dist = this.position.distanceTo(this.serverPosition)
        if (dist > GSettings.BALL_CLIENT_SERVER_LERP_DIST) {
            this.position.lerp(this.serverPosition, GSettings.BALL_CLIENT_SERVER_LERP_FACTOR);
            this.speed.copy(this.serverSpeed);
        }
        this.changeColorAtLimit();
    }
}
