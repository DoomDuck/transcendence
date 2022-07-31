"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.updateVectorDeltaT = void 0;
const three_1 = require("three");
const _v = new three_1.Vector3();
function updateVectorDeltaT(v, vspeed, elapsed) {
    _v.copy(vspeed);
    _v.multiplyScalar(elapsed / 1000);
    v.add(_v);
}
exports.updateVectorDeltaT = updateVectorDeltaT;
function delay(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}
exports.delay = delay;
//# sourceMappingURL=utils.js.map