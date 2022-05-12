import { Vector3 } from "three";
import { Ball } from "./Ball";
import { Bar } from "./Bar";

// source: https://mathworld.wolfram.com/Circle-LineIntersection.html
// returns intersections points as an array
// if two intersections, the first is the one closer to p1
export function lineCircleIntersection(p1: Vector3, p2: Vector3, center: Vector3, radius: number): Vector3[] {
    var dx = p2.x - p1.x;
    var dy = p2.y - p1.y;
    var dr = Math.sqrt(dx * dx + dy * dy);
    var drSq = dr * dr;
    var D = p1.x * p2.y - p1.y * p2.x;
    var discriminant = radius * radius * drSq - D * D;
    var I0 = new Vector3();
    if (discriminant < 0)
        return [];
    I0.x = D * dy / (drSq);
    I0.y = -D * dx / (drSq);
    if (discriminant == 0) {
        return [I0];
    }
    else {
        var discriminantSqrt = Math.sqrt(discriminant);
        var dySign = dy == 0 ? 1 : Math.sign(dy);
        var dIx = dySign * dx * discriminantSqrt;
        var dIy = Math.abs(dy) * discriminantSqrt;
        var I1 = I0.clone();
        var I2 = I0.clone();
        I1.x += dIx;
        I1.y += dIy;
        I2.x -= dIx;
        I2.y -= dIy;
        return [I1, I2];
    }
}

// Return the corrected ball.deltaPos
// Computations take place in the ball referencial
export function ballBarContinuousCollision(ball: Ball, bar: Bar, elapsedTime: number): Vector3 {
    var ballAbsoluteDelta = ball.getDeltaPosition(elapsedTime);
    // if (Math.abs(ball.position.x + ballDeltaPos.x - bar.position.x) >= ball.radius)
    //     return ballDeltaPos;
    var relativeDelta = bar.getDeltaPos(elapsedTime);
    relativeDelta.sub(ball.getDeltaPosition(elapsedTime));

    var barCornerTop, barCornerBottom;
    barCornerTop = new Vector3(bar.collisionEdgeX() - ball.position.x, bar.topY());
    barCornerBottom = new Vector3(barCornerTop.x, bar.bottomY());

    // side collision
    

}
