"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ball = void 0;
const three_1 = require("three");
const constants_1 = require("../../common/constants");
const collision_1 = require("./collision");
const utils_1 = require("../utils");
class Ball {
    constructor() {
        this.radius = constants_1.GSettings.BALL_RADIUS;
        this.position = new three_1.Vector3();
        this.speed = new three_1.Vector3();
        this.wallCollided = false;
        this.outOfScreenAlreadyReported = false;
    }
    reset(x, y, vx, vy) {
        this.position.set(x, y, 0);
        this.speed.set(vx, vy, 0);
        this.outOfScreenAlreadyReported = false;
    }
    topY() {
        return this.position.y - this.radius;
    }
    bottomY() {
        return this.position.y + this.radius;
    }
    rightX() {
        return this.position.x + this.radius;
    }
    leftX() {
        return this.position.x - this.radius;
    }
    setTopY(y) {
        this.position.y = y + this.radius;
    }
    setBottomY(y) {
        this.position.y = y - this.radius;
    }
    gotOutOfScreen() {
        if (this.outOfScreenAlreadyReported)
            return false;
        if (this.leftX() > constants_1.GSettings.GAME_RIGHT ||
            this.rightX() < constants_1.GSettings.GAME_LEFT) {
            this.outOfScreenAlreadyReported = true;
            return true;
        }
        return false;
    }
    farthestPlayerSide() {
        return this.position.x < 0 ? constants_1.PLAYER2 : constants_1.PLAYER1;
    }
    update(elapsed, bars) {
        (0, utils_1.updateVectorDeltaT)(this.position, this.speed, elapsed);
        this.handleCollisions(bars);
    }
    handleBarCollision(bar) {
        if (this.speed.x * bar.collisionEdgeDirection > 0)
            return;
        let collision = (0, collision_1.ballBarCollisionDistanceData)(this, bar);
        let distance = collision.distanceVec.length();
        if (!collision.inside && distance >= this.radius)
            return;
        if (!collision.inside &&
            collision.distanceVec.x * bar.collisionEdgeDirection < 0)
            return;
        if (collision.vertical && this.wallCollided) {
            this.speed.y = 0;
            return;
        }
        let posCorrection = collision.distanceVec.clone();
        if (!collision.inside)
            posCorrection.setLength(this.radius - distance);
        else
            posCorrection.setLength(this.radius + distance);
        this.position.add(posCorrection);
        if (collision.horizontal || collision.corner) {
            this.speed.x *= -1;
            this.speed.x += Math.sign(this.speed.x) * constants_1.GSettings.BALL_SPEEDX_INCREASE;
            if (collision.corner)
                this.speed.x +=
                    Math.sign(this.speed.x) * constants_1.GSettings.BALL_SPEEDX_CORNER_BOOST;
            if (Math.abs(this.speed.x) > constants_1.GSettings.BALL_SPEEDX_MAX)
                this.speed.x = Math.sign(this.speed.x) * constants_1.GSettings.BALL_SPEEDX_MAX;
            let deltaY = this.position.y - bar.position.y;
            if (collision.corner) {
                deltaY = Math.sign(deltaY) * bar.height;
                this.speed.x +=
                    Math.sign(this.speed.x) * constants_1.GSettings.BALL_SPEEDX_CORNER_BOOST;
            }
            this.speed.y = (deltaY / bar.height) * constants_1.GSettings.BALL_SPEEDY_MAX;
        }
        else if (collision.vertical) {
            this.speed.y *= -1;
        }
    }
    handleWallCollisions() {
        this.wallCollided = true;
        if (this.topY() <= constants_1.GSettings.GAME_TOP) {
            this.speed.y = Math.abs(this.speed.y);
            this.setTopY(constants_1.GSettings.GAME_TOP);
        }
        else if (this.bottomY() >= constants_1.GSettings.GAME_BOTTOM) {
            this.speed.y = -Math.abs(this.speed.y);
            this.setBottomY(constants_1.GSettings.GAME_BOTTOM);
        }
        else
            this.wallCollided = false;
    }
    handleCollisions(bars) {
        this.handleBarCollision(bars[0]);
        this.handleBarCollision(bars[1]);
        this.handleWallCollisions();
    }
}
exports.Ball = Ball;
//# sourceMappingURL=Ball.js.map