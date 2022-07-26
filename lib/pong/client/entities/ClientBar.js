"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientBar = void 0;
const entities_1 = require("../../common/entities");
const constants_1 = require("../../common/constants");
const graphic_1 = require("../graphic");
class ClientBar extends entities_1.Bar {
    constructor(playerId) {
        super(playerId);
        this.mesh = new graphic_1.BarMesh();
        this.position = this.mesh.position;
        this.reset();
    }
    handleKeydown(e, emitFunction) {
        if (constants_1.GSettings.BAR_UP_KEYS.includes(e.key)) {
            if (this.upPressed)
                return;
            this.upPressed = true;
            emitFunction(constants_1.GameEvent.SEND_BAR_KEYDOWN, constants_1.KeyValue.UP, Date.now());
        }
        else if (constants_1.GSettings.BAR_DOWN_KEYS.includes(e.key)) {
            if (this.downPressed)
                return;
            this.downPressed = true;
            emitFunction(constants_1.GameEvent.SEND_BAR_KEYDOWN, constants_1.KeyValue.DOWN, Date.now());
        }
    }
    handleKeyup(e, emitFunction) {
        if (constants_1.GSettings.BAR_UP_KEYS.includes(e.key)) {
            this.upPressed = false;
            emitFunction(constants_1.GameEvent.SEND_BAR_KEYUP, constants_1.KeyValue.UP, this.position.y);
        }
        else if (constants_1.GSettings.BAR_DOWN_KEYS.includes(e.key)) {
            this.downPressed = false;
            emitFunction(constants_1.GameEvent.SEND_BAR_KEYUP, constants_1.KeyValue.DOWN, this.position.y);
        }
    }
}
exports.ClientBar = ClientBar;
//# sourceMappingURL=ClientBar.js.map