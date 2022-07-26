"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientBall = void 0;
const entities_1 = require("../../common/entities");
const constants_1 = require("../../common/constants");
const graphic_1 = require("../graphic");
const three_1 = require("three");
const utils_1 = require("../../common/utils");
class ClientBall extends entities_1.Ball {
    constructor(playerId) {
        super();
        this.mesh = new graphic_1.BallMesh();
        this.position = this.mesh.position;
        this.playerId = playerId;
        this.serverPosition = new three_1.Vector3();
        this.serverSpeed = new three_1.Vector3();
    }
    reset(x, y, vx, vy) {
        super.reset(x, y, vx, vy);
        this.mesh.color.set(0xffffff);
    }
    changeColorAtLimit() {
        let dx = 0;
        let atLimit = false;
        if (this.rightX() > constants_1.GSettings.GAME_RIGHT) {
            atLimit = true;
            dx = this.rightX() - constants_1.GSettings.GAME_RIGHT;
        }
        else if (this.leftX() < constants_1.GSettings.GAME_LEFT) {
            atLimit = true;
            dx = constants_1.GSettings.GAME_LEFT - this.leftX();
        }
        if (atLimit) {
            let k = Math.max(-1, 1 - dx / this.radius);
            let surfaceRatio = Math.acos(k) - k * Math.sqrt(1 - k ** 2);
            this.mesh.color.setRGB(1, 1 - surfaceRatio, 1 - surfaceRatio);
        }
    }
    handleReceiveSetBall(x, y, vx, vy, time) {
        let elapsed = Date.now() - time;
        this.serverPosition.set(x, y, 0);
        this.serverSpeed.set(vx, vy, 0);
        (0, utils_1.updateVectorDeltaT)(this.serverPosition, this.serverSpeed, elapsed);
    }
    update(elapsed, bars) {
        super.update(elapsed, bars);
        const dist = this.position.distanceTo(this.serverPosition);
        if (dist > constants_1.GSettings.BALL_CLIENT_SERVER_LERP_DIST) {
            this.position.lerp(this.serverPosition, constants_1.GSettings.BALL_CLIENT_SERVER_LERP_FACTOR);
            this.speed.copy(this.serverSpeed);
        }
        this.changeColorAtLimit();
    }
}
exports.ClientBall = ClientBall;
//# sourceMappingURL=ClientBall.js.map