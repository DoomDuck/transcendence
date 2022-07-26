"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BallMesh = void 0;
const THREE = require("three");
const constants_1 = require("../../common/constants");
class BallMesh extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.CylinderGeometry(constants_1.GSettings.BALL_RADIUS, constants_1.GSettings.BALL_RADIUS, 1, constants_1.GSettings.BALL_RADIAL_SEGMENTS);
        const color = new THREE.Color(constants_1.GSettings.BALL_COLOR);
        const material = new THREE.MeshBasicMaterial({
            color: color,
        });
        super(geometry, material);
        this.rotateX(THREE.MathUtils.degToRad(90));
        this.color = color;
    }
}
exports.BallMesh = BallMesh;
//# sourceMappingURL=BallMesh.js.map