"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientBar = void 0;
const THREE = require("three");
const Bar_1 = require("../common/Bar");
const constants_1 = require("../common/constants");
class ClientBar extends Bar_1.Bar {
    constructor(playerId) {
        super(playerId);
        const geometry = new THREE.BoxGeometry(constants_1.GSettings.BAR_WIDTH, constants_1.GSettings.BAR_HEIGHT);
        const material = new THREE.MeshBasicMaterial({
            color: 0xd14081,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.position = this.mesh.position;
        this.reset();
    }
}
exports.ClientBar = ClientBar;
//# sourceMappingURL=ClientBar.js.map