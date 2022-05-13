import { Vector3 } from "three";
import { Ball } from "./Ball";
import { Bar } from "./Bar";

// source: https://mathworld.wolfram.com/Circle-LineIntersection.html
// returns the ratio of the distance p1 to I over p1 to p2 if an intersection point I exists between p1 and p2 (the closest to p1)
// if two intersections, the first is the one closer to p1
export function segmentCircleIntersection(x1: number, y1: number, x2: number, y2: number, cX: number, cY: number, radius: number): number | null {
    x1 -= cX;
    x2 -= cX;
    y1 -= cY;
    y2 -= cY;
    var dx = x2 - x1;
    var dy = y2 - y1;
    const pointsInSegmentRatio = (x: number, y: number): number | null => {
        var c1 = -dy * x1 + dx * y1;
        var c2 = -dy * x2 + dx * y2;
        var [cMin, cMax] = [Math.min(c1, c2), Math.max(c1, c2)];
        var c = -dy * x + dx * y;
        if ((cMin < c) && (c < cMax))
            return (c - c1) / (c2 - c1);
        else
            return null;
    }
    var dr = Math.sqrt(dx * dx + dy * dy);
    var drSq = dr * dr;
    var D = x1 * y2 - y1 * x2;
    var discriminant = radius * radius * drSq - D * D;
    if (discriminant < 0)
        return null;

    var Ix = D * dy / drSq + cX;
    var Iy = -D * dx / drSq + cY;
    if (discriminant == 0) {
        return pointsInSegmentRatio(Ix, Iy);
    }
    else {
        var discriminantSqrt = Math.sqrt(discriminant);
        var dySign = dy == 0 ? 1 : Math.sign(dy);
        var dIx = dySign * dx * discriminantSqrt / drSq;
        var dIy = Math.abs(dy) * discriminantSqrt / drSq;
        // var I1 = I.clone();
        // var I2 = I.clone();
        // I1.x += dIx;
        // I1.y += dIy;
        // I2.x -= dIx;
        // I2.y -= dIy;
        // return [I1, I2].filter(pointsInSegment);
        var directionTo2 = Math.sign(dx * dIx + dy * dIy)
        Ix += -directionTo2 * dIx;
        Iy += -directionTo2 * dIy;
        return pointsInSegmentRatio(Ix, Iy);
    }
}


// Return the corrected ball.deltaPos
// Computations take place in the ball referencial
export function ballBarContinuousCollision(ball: Ball, bar: Bar, elapsedTime: number) {
    var ballDeltaPos = ball.getDeltaPosition(elapsedTime);
    // if (Math.abs(ball.position.x + ballDeltaPos.x - bar.position.x) >= ball.radius)
    //     return ballDeltaPos;
    var barDeltaPos = bar.getDeltaPos(elapsedTime);
    var dx = barDeltaPos.x - ballDeltaPos.x;
    var dy = barDeltaPos.y - ballDeltaPos.y;

    var x1 = bar.collisionEdgeX() - ball.position.x;
    var x2 = x1 + dx;
    if (dx * x1 > 0)
        return;
    if (Math.abs(x2) * Math.sign(dx) <= -ball.radius) // the ball can't have reached the bar
        return;

    // Top and bottom point of the colliding edge of the bar, relative to the ball
    var y1Top = bar.topY() - ball.position.y;
    var y1Bottom = bar.bottomY() - ball.position.y;
    var y2Top = y1Top + dy;
    var y2Bottom = y1Bottom + dy;
    if (Math.min(y1Top, y2Top) >= ball.radius || Math.max(y1Bottom, y2Bottom) <= -ball.radius)
        return;

    // side collision
    var ballX = Math.sign(x1) * ball.radius;
    var k = (ballX - x1) / dx;
    if (k >= 0 && k < 1) {
        var yTop = y1Top + k * dy;
        var yBottom = y1Bottom + k * dy;
        if (yTop < 0 && yBottom > 0) {
            ball.sideCollision(
                k,
                (yTop + yBottom) / 2,
                bar,
            )
            return;

        }
    }

    // corner collision
    var y1 = dy > 0 ? y1Bottom : y1Top;
    var y2 = dy > 0 ? y2Bottom : y2Top;
    var intersectionRatio = segmentCircleIntersection(x1, x2, y1, y2, ball.position.x, ball.position.y, ball.radius);
    if (intersectionRatio !== null) {
        k = intersectionRatio as number;
        var corner = new Vector3(
            x1 + k * dx,
            y1 + k * dy,
            0
        );
        ball.cornerCollision(
            k,
            corner,
            dy > 0 ? 1 : -1,
            bar
        )
    }
}
