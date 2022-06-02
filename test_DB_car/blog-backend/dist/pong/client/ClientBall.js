"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientBall = void 0;
const THREE = require("three");
const Ball_1 = require("../common/Ball");
const constants_1 = require("../common/constants");
class ClientBall extends Ball_1.Ball {
    constructor(playerId) {
        super();
        const geometry = new THREE.CylinderGeometry(constants_1.GSettings.BALL_RADIUS, constants_1.GSettings.BALL_RADIUS, 1, constants_1.GSettings.BALL_RADIAL_SEGMENTS);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        });
        this.color = material.color;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotateX(THREE.MathUtils.degToRad(90));
        this.position = this.mesh.position;
        this.playerId = playerId;
        this.atLimit = false;
        this.atLimitPrevious = false;
        this.atMyLimit = false;
    }
    reset(x, y, vx, vy) {
        super.reset(x, y, vx, vy);
        this.color.set(0xffffff);
        this.atLimit = false;
        this.atLimitPrevious = false;
        this.atMyLimit = false;
        console.log('clientball reset called');
    }
    emitGoalAtMyLimit() {
        this.emit(constants_1.GameEvent.SEND_GOAL, this.playerId == constants_1.PLAYER1 ? constants_1.PLAYER2 : constants_1.PLAYER1);
    }
    update(elapsed) {
        super.update(elapsed);
        this.atLimitPrevious = this.atLimit;
        let dx = 0;
        if (this.rightX() > constants_1.GSettings.GAME_RIGHT) {
            this.atLimit = true;
            dx = this.rightX() - constants_1.GSettings.GAME_RIGHT;
        }
        else if (this.leftX() < constants_1.GSettings.GAME_LEFT) {
            this.atLimit = true;
            dx = constants_1.GSettings.GAME_LEFT - this.leftX();
        }
        if (this.atLimit && !this.atLimitPrevious) {
            let speedRatio = constants_1.GSettings.BALL_SPEED_AT_LIMIT / Math.abs(this.speed.x);
            this.speed.multiplyScalar(speedRatio);
        }
        if (this.atLimit) {
            let k = Math.max(-1, 1 - dx / this.radius);
            let surfaceRatio = Math.acos(k) - k * Math.sqrt(1 - k ** 2);
            this.color.setRGB(1, 1 - surfaceRatio, 1 - surfaceRatio);
        }
        if (!this.atMyLimit && ((this.leftX() > constants_1.GSettings.GAME_RIGHT && this.playerId == constants_1.PLAYER2)
            || (this.rightX() < constants_1.GSettings.GAME_LEFT && this.playerId == constants_1.PLAYER1))) {
            this.atMyLimit = true;
            this.emitGoalAtMyLimit();
        }
    }
}
exports.ClientBall = ClientBall;
//# sourceMappingURL=ClientBall.js.map