import { Vector3 } from 'three';
import { Ball } from './Ball'
import { Bar } from './Bar'
import { GSettings } from './constants';

export interface CollisionData  {
    distanceVec: Vector3,
    distance: number,
}

export interface BallBarCollisionData extends CollisionData {
    inside: boolean,
    corner: boolean,
    horizontal: boolean,
    vertical: boolean,
}

export interface BallWallCollisionData extends CollisionData {

}

export interface CollisionResult {
    ignore: boolean,
    data: CollisionData,
}

/**
 * Return whether the ball is inside and the distance from the
 * bar to the ball (edges of the rectangle to center)
 * @param {Ball} ball
 * @param {Bar} bar
 * @returns ...
 */
//
export function ballBarCollisionDistanceData(ball: Ball, bar: Bar): BallBarCollisionData {
    let distanceToCenter = new Vector3();
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
    distanceToCenter.x -= signX * (bar.width / 2)
    distanceToCenter.y -= signY * (bar.height / 2)
    if (x > 0 && y < 0) {
        // lateral face
        distanceToCenter.y = 0;
        horizontal = true;
    }
    else if (x < 0 && y > 0) {
        // upper/lower face
        distanceToCenter.x = 0;
        vertical = true;
    }
    else if (x > 0 && y > 0) {
        // diagonal
        corner = true;
    }
    // the center of the ball is inside of the bar
    else if (x < y) {
        // closer to the top/bottom
        inside = true;
        distanceToCenter.x = 0;
        distanceToCenter.y = - distanceToCenter.y;
    }
    else {
        // closer to the sides
        inside = true;
        distanceToCenter.x = - distanceToCenter.x;
        distanceToCenter.y = 0;
    }

    return {
        inside: inside,
        corner: corner,
        horizontal: horizontal,
        vertical: vertical,
        distanceVec: distanceToCenter,
        distance: (inside ? -1:1) * distanceToCenter.length(),
    };
}

export function ballBarCollisionDetection(ball: Ball, bar: Bar): CollisionResult {
    let data = ballBarCollisionDistanceData(ball, bar);
    let result: CollisionResult = {
        ignore: true,
        data: data,
    };
    if (ball.speed.x * bar.collisionEdgeDirection > 0)
        return result;
    let collision = ballBarCollisionDistanceData(ball, bar);
    let distance = collision.distanceVec.length();
    if (!collision.inside && distance >= ball.radius)
        return result;
    if (!collision.inside && collision.distanceVec.x * bar.collisionEdgeDirection < 0)
        return result;
    result.ignore = false;
    return result;
}

export function ballWallsCollisionDetection(ball: Ball): [CollisionResult, CollisionResult] {
    let yTop = ball.position.y - GSettings.GAME_TOP;
    let yBottom = ball.position.y - GSettings.GAME_BOTTOM;

    let resultTop: CollisionResult = {
        ignore: yTop >= ball.radius,
        data: {
            distanceVec: new Vector3(0, Math.abs(yTop), 0),
            distance: yTop,
        }
    }
    let resultBottom: CollisionResult = {
        ignore: yBottom <= -ball.radius,
        data: {
            distanceVec: new Vector3(0, Math.abs(yBottom), 0),
            distance: yBottom,
        }
    }
    return [resultTop, resultBottom];
}
