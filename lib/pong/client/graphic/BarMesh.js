"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarMesh = void 0;
const THREE = require("three");
const constants_1 = require("../../common/constants");
class BarMesh extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.BoxGeometry(constants_1.GSettings.BAR_WIDTH, constants_1.GSettings.BAR_HEIGHT);
        const material = new THREE.MeshBasicMaterial({
            color: constants_1.GSettings.BAR_COLOR,
        });
        super(geometry, material);
    }
}
exports.BarMesh = BarMesh;
//# sourceMappingURL=BarMesh.js.map