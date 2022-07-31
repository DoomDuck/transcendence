"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera = void 0;
const THREE = require("three");
const constants_1 = require("../../common/constants");
class Camera extends THREE.OrthographicCamera {
    constructor() {
        super();
        this.left = constants_1.GSettings.SCREEN_LEFT;
        this.right = constants_1.GSettings.SCREEN_RIGHT;
        this.top = constants_1.GSettings.SCREEN_TOP;
        this.bottom = constants_1.GSettings.SCREEN_BOTTOM;
        this.near = 0;
        this.far = 1000;
        this.position.z = 10;
        this.updateProjectionMatrix();
    }
}
exports.Camera = Camera;
//# sourceMappingURL=Camera.js.map