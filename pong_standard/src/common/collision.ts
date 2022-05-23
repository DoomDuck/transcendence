import { Vector3 } from 'three';
import { Ball } from './Ball'
import { Bar } from './Bar'

/**
 * Return whether the ball is inside and the distance from the
 * bar to the ball (edges of the rectangle to center)
 * @param {Ball} ball
 * @param {Bar} bar
 * @returns {[boolean, Vector3]} -
 */
//
export function ballBarCollisionDistance(ball: Ball, bar: Bar): [boolean, Vector3] {
    let distanceToCenter = new Vector3();
    let isInside = false;

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
    }
    else if (x < 0 && y > 0) {
        // upper face
        distanceToCenter.x = 0;
    }
    else if (x > 0 && y > 0) {
        // diagonal
        // TODO: Speed boost
    }
    else  {
        isInside = true;
    }

    return [isInside, distanceToCenter];
}
