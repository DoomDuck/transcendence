import { Vector3 } from "three";
import { Ball } from "./Ball";
import { Bar } from "./Bar";

interface BarBallRelativePosition {
    collision: boolean;
}

class Facing implements BarBallRelativePosition {
    x: number;
    collision: boolean;
    constructor(x: number, collision: boolean) {
        this.x = x;
        this.collision = collision;
    }
}

class Behind implements BarBallRelativePosition {
    collision: boolean;
    constructor() {
        this.collision = false;
    }
}


class OnSide implements BarBallRelativePosition {
    y: number;
    collision: boolean;
    constructor(y: number, collision: boolean) {
        this.y = y;
        this.collision = collision;
    }
}

class Corner implements BarBallRelativePosition {
    x: number;
    y: number;
    collision: boolean;
    constructor(x: number, y: number, collision: boolean) {
        this.x = x;
        this.y = y;
        this.collision = collision;
    }
}

function relativePosition(ball: Ball, bar: Bar) {
    var ballFront = ball.front(bar.frontDirection);
    var ballBack = ball.back(-bar.frontDirection);
    var ballTop = ball.top();
    var ballBottom = ball.bottom();
    var barFront = bar.front();
    var barBack = bar.back();
    var barTop = bar.top();
    var barBottom = bar.bottom();

    var dx = (ballBack - barFront);
    if (dx * bar.frontDirection > 0)
        return new Behind();
    var dyCenter = ball.position.y - bar.position.y;
    var signY = Math.sign(dyCenter);
    var barY = dyCenter > 0 ? barBottom : barTop;
    var ballY = dyCenter > 0 ? ballBottom : ballTop;
    var dy = ballY - barY;
    if (dy * Math.sign(dyCenter) < 0)
        



    // distanceToBorder: bar to ball-border
    if (x > 0 && y < 0) {
        // lateral face
    }
    else if (x < 0 && y > 0) {
        // upper face
        distanceToCenter.x = 0;
    }
    else if (x > 0 && y > 0) {
        // diagonal
    }
    else  {
        // inside
    }

}
