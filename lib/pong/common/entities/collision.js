"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ballWallsCollisionDetection = exports.ballBarCollisionDetection = exports.ballBarCollisionDistanceData = void 0;
const three_1 = require("three");
const constants_1 = require("../constants");
function ballBarCollisionDistanceData(ball, bar) {
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
    if (x > 0 && y <= 0) {
        distanceToCenter.y = 0;
        horizontal = true;
    }
    else if (x <= 0 && y > 0) {
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
        distance: (inside ? -1 : 1) * distanceToCenter.length(),
    };
}
exports.ballBarCollisionDistanceData = ballBarCollisionDistanceData;
function ballBarCollisionDetection(ball, bar) {
    let data = ballBarCollisionDistanceData(ball, bar);
    let result = {
        ignore: true,
        data: data,
    };
    if (ball.speed.x * bar.collisionEdgeDirection > 0)
        return result;
    let collision = ballBarCollisionDistanceData(ball, bar);
    let distance = collision.distanceVec.length();
    if (!collision.inside && distance >= ball.radius)
        return result;
    if (!collision.inside &&
        collision.distanceVec.x * bar.collisionEdgeDirection < 0)
        return result;
    result.ignore = false;
    return result;
}
exports.ballBarCollisionDetection = ballBarCollisionDetection;
function ballWallsCollisionDetection(ball) {
    let yTop = ball.position.y - constants_1.GSettings.GAME_TOP;
    let yBottom = ball.position.y - constants_1.GSettings.GAME_BOTTOM;
    let resultTop = {
        ignore: yTop >= ball.radius,
        data: {
            distanceVec: new three_1.Vector3(0, Math.abs(yTop), 0),
            distance: yTop,
        },
    };
    let resultBottom = {
        ignore: yBottom <= -ball.radius,
        data: {
            distanceVec: new three_1.Vector3(0, Math.abs(yBottom), 0),
            distance: yBottom,
        },
    };
    return [resultTop, resultBottom];
}
exports.ballWallsCollisionDetection = ballWallsCollisionDetection;
//# sourceMappingURL=collision.js.map