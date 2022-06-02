"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ballBarCollision = void 0;
const three_1 = require("three");
function ballBarCollision(ball, bar) {
    let distanceToCenter = new three_1.Vector3();
    let inside = false;
    let corner = false;
    let horizontal = false;
    let vertical = false;
    distanceToCenter.copy(ball.position);
    distanceToCenter.sub(bar.position);
    let signX = Math.sign(distanceToCenter.x);
    let signY = Math.sign(distanceToCenter.y);
    let x = Math.abs(distanceToCenter.x) - bar.width / 2;
    let y = Math.abs(distanceToCenter.y) - bar.height / 2;
    distanceToCenter.x -= signX * (bar.width / 2);
    distanceToCenter.y -= signY * (bar.height / 2);
    if (x > 0 && y < 0) {
        distanceToCenter.y = 0;
        horizontal = true;
    }
    else if (x < 0 && y > 0) {
        distanceToCenter.x = 0;
        vertical = true;
    }
    else if (x > 0 && y > 0) {
        corner = true;
    }
    else if (x < y) {
        inside = true;
        distanceToCenter.x = 0;
        distanceToCenter.y = -distanceToCenter.y;
    }
    else {
        inside = true;
        distanceToCenter.x = -distanceToCenter.x;
        distanceToCenter.y = 0;
    }
    return {
        inside: inside,
        corner: corner,
        horizontal: horizontal,
        vertical: vertical,
        distanceVec: distanceToCenter,
    };
}
exports.ballBarCollision = ballBarCollision;
//# sourceMappingURL=collision.js.map