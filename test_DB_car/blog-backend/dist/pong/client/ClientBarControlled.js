"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientBarControlled = void 0;
const ClientBar_1 = require("./ClientBar");
const constants_1 = require("../common/constants");
const common_1 = require("../common");
class ClientBarControlled extends ClientBar_1.ClientBar {
    constructor(playerId) {
        super(playerId);
        this.upKeys = ['ArrowUp'];
        this.downKeys = ['ArrowDown'];
        window.addEventListener('keydown', this.handleKeydown.bind(this), false);
        window.addEventListener('keyup', this.handleKeyup.bind(this), false);
    }
    collisionEdgeX() {
        return this.position.x + this.collisionEdgeDirection * this.width / 2;
    }
    handleKeydown(e) {
        if (this.upKeys.includes(e.key)) {
            if (this.upPressed)
                return;
            this.upPressed = true;
            this.emit(common_1.GameEvent.SEND_BAR_KEYDOWN, constants_1.KeyValue.UP, Date.now());
        }
        else if (this.downKeys.includes(e.key)) {
            if (this.downPressed)
                return;
            this.downPressed = true;
            this.emit(common_1.GameEvent.SEND_BAR_KEYDOWN, constants_1.KeyValue.DOWN, Date.now());
        }
    }
    handleKeyup(e) {
        if (this.upKeys.includes(e.key)) {
            this.upPressed = false;
            this.emit(common_1.GameEvent.SEND_BAR_KEYUP, +constants_1.KeyValue.UP, this.position.y);
        }
        else if (this.downKeys.includes(e.key)) {
            this.downPressed = false;
            this.emit(common_1.GameEvent.SEND_BAR_KEYUP, +constants_1.KeyValue.DOWN, this.position.y);
        }
    }
}
exports.ClientBarControlled = ClientBarControlled;
//# sourceMappingURL=ClientBarControlled.js.map