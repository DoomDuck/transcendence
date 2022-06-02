"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerBall = void 0;
const THREE = require("three");
const Ball_1 = require("../common/Ball");
const constants_1 = require("../common/constants");
class ServerBall extends Ball_1.Ball {
    constructor() {
        super();
        const geometry = new THREE.CylinderGeometry(constants_1.GSettings.BALL_RADIUS, constants_1.GSettings.BALL_RADIUS, 1, constants_1.GSettings.BALL_RADIAL_SEGMENTS);
        const material = new THREE.MeshBasicMaterial({
            color: 0x10b7b7,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotateX(THREE.MathUtils.degToRad(90));
        this.position = this.mesh.position;
    }
}
exports.ServerBall = ServerBall;
//# sourceMappingURL=ServerBall.js.map