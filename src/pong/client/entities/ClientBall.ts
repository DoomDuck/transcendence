import { Ball } from "../../common/entities";
import { GSettings, PlayerID } from "../../common/constants";
import { BallMesh } from './graphic';

export class ClientBall extends Ball {
    mesh: BallMesh;
    playerId: PlayerID;

    constructor(playerId: PlayerID) {
        super();
        this.mesh = new BallMesh();
        this.position = this.mesh.position;
        this.playerId = playerId;
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

    update(elapsed: number) {
        super.update(elapsed);
        this.changeColorAtLimit();
    }
}
