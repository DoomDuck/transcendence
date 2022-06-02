"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ball = void 0;
const three_1 = require("three");
const constants_1 = require("./constants");
const collision_1 = require("./collision");
const events_1 = require("events");
let _v = new three_1.Vector3();
class Ball extends events_1.EventEmitter {
    constructor() {
        super();
        this.radius = constants_1.GSettings.BALL_RADIUS;
        this.position = new three_1.Vector3();
        this.speed = new three_1.Vector3();
        this.on(constants_1.GameEvent.RECEIVE_SET_BALL, this.handleReceiveSetBall.bind(this));
        this.wallCollided = false;
    }
    reset(x, y, vx, vy) {
        this.position.set(x, y, 0);
        this.speed.set(vx, vy, 0);
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
    updatePosition(elapsedTime) {
        _v.copy(this.speed);
        _v.multiplyScalar(elapsedTime / 1000);
        this.position.add(_v);
    }
    update(elapsedTime) {
        this.updatePosition(elapsedTime);
    }
    handleBarCollision(bar) {
        if (this.speed.x * bar.collisionEdgeDirection > 0)
            return;
        let collision = (0, collision_1.ballBarCollision)(this, bar);
        let distance = collision.distanceVec.length();
        if (!collision.inside && distance >= this.radius)
            return;
        if (!collision.inside && collision.distanceVec.x * bar.collisionEdgeDirection < 0)
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
                this.speed.x += Math.sign(this.speed.x) * constants_1.GSettings.BALL_SPEEDX_CORNER_BOOST;
            if (Math.abs(this.speed.x) > constants_1.GSettings.BALL_SPEEDX_MAX)
                this.speed.x = Math.sign(this.speed.x) * constants_1.GSettings.BALL_SPEEDX_MAX;
            let deltaY = this.position.y - bar.position.y;
            if (collision.corner) {
                deltaY = Math.sign(deltaY) * bar.height;
                this.speed.x += Math.sign(this.speed.x) * constants_1.GSettings.BALL_SPEEDX_CORNER_BOOST;
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
    handleReceiveSetBall(x, y, vx, vy) {
        this.position.set(x, y, 0);
        this.speed.set(vx, vy, 0);
    }
}
exports.Ball = Ball;
//# sourceMappingURL=Ball.js.map