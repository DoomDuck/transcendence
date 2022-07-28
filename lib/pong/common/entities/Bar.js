"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bar = void 0;
const three_1 = require("three");
const constants_1 = require("../constants");
class Bar {
    constructor(playerId) {
        this.width = constants_1.GSettings.BAR_WIDTH;
        this.height = constants_1.GSettings.BAR_HEIGHT;
        this.collisionEdgeDirection = playerId == constants_1.PLAYER1 ? constants_1.RIGHT : constants_1.LEFT;
        this.position = new three_1.Vector3();
        this.upPressed = false;
        this.downPressed = false;
    }
    reset() {
        this.position.set(-this.collisionEdgeDirection * constants_1.GSettings.BAR_INITIALX, constants_1.GSettings.BAR_INITIALY, 0);
        this.upPressed = false;
        this.downPressed = false;
    }
    setTopY(y) {
        this.position.y = y + this.height / 2;
    }
    setBottomY(y) {
        this.position.y = y - this.height / 2;
    }
    topY() {
        return this.position.y - this.height / 2;
    }
    bottomY() {
        return this.position.y + this.height / 2;
    }
    clipPosition() {
        if (this.topY() < constants_1.GSettings.GAME_TOP)
            this.setTopY(constants_1.GSettings.GAME_TOP);
        else if (this.bottomY() > constants_1.GSettings.GAME_BOTTOM)
            this.setBottomY(constants_1.GSettings.GAME_BOTTOM);
    }
    onReceiveKeydown(keyValue, emitTime) {
        let delta = Date.now() - emitTime;
        if (keyValue == constants_1.KeyValue.UP) {
            this.position.y -= (delta * constants_1.GSettings.BAR_SENSITIVITY) / 1000;
            this.upPressed = true;
        }
        else {
            this.position.y += (delta * constants_1.GSettings.BAR_SENSITIVITY) / 1000;
            this.downPressed = true;
        }
        this.clipPosition();
    }
    onReceiveKeyup(keyValue, y) {
        if (keyValue == constants_1.KeyValue.UP) {
            this.upPressed = false;
        }
        else {
            this.downPressed = false;
        }
        this.position.y = y;
    }
    onReceivePosition(y) {
        this.position.y = y;
    }
    speed() {
        return (+this.downPressed - +this.upPressed) * constants_1.GSettings.BAR_SENSITIVITY;
    }
    update(elapsed) {
        this.position.y += (elapsed * this.speed()) / 1000;
        this.clipPosition();
    }
}
exports.Bar = Bar;
//# sourceMappingURL=Bar.js.map