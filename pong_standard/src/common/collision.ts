import { Vector3 } from 'three';
import { Ball } from './Ball'
import { Bar } from './Bar'

/**
 * Return whether the ball is inside and the distance from the
 * bar to the ball (edges of the rectangle to center)
 * @param {Ball} ball
 * @param {Bar} bar
 * @returns {[boolean, Vector3]} - whether the center of the ball is inside and the distance vector
 */
//
export function ballBarCollision(ball: Ball, bar: Bar): {inside: boolean, corner: boolean, distanceVec: Vector3} {
    let distanceToCenter = new Vector3();
    let inside = false;
    let corner = false;

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
        distanceVec: distanceToCenter,
    };
}
