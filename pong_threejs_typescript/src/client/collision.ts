import { Vector3 } from 'three';
import { PhysicBall } from './PhysicBall'
import { Bar } from './Bar'

export function ballBarDistance(ball: PhysicBall, bar: Bar): [Vector3, Vector3, Vector3] {
    var distanceToCenter = new Vector3();
    var distanceToBorder = new Vector3();
    var closestPoint = new Vector3();

    distanceToCenter.copy(ball.position);
    distanceToCenter.sub(bar.position);
    var signX = Math.sign(distanceToCenter.x);
    var signY = Math.sign(distanceToCenter.y);
    var x = Math.abs(distanceToCenter.x) - bar.width / 2;
    var y = Math.abs(distanceToCenter.y) - bar.height / 2;
    distanceToCenter.x -= signX * (bar.width / 2)
    distanceToCenter.y -= signY * (bar.height / 2)
    // distanceToBorder: bar to ball-border
    if (x > 0 && y < 0) {
        // lateral face
        distanceToCenter.set(distanceToCenter.x, 0, 0);
        closestPoint.set(bar.position.x + signX * bar.width / 2, ball.position.y, 0);
    }
    else if (x < 0 && y > 0) {
        // upper face
        distanceToCenter.set(0, distanceToCenter.y, 0);
        closestPoint.set(ball.position.x, bar.position.y + signY * bar.height / 2, 0);
    }
    else if (x > 0 && y > 0) {
        // diagonal
        closestPoint.set(bar.position.x + signX * bar.width / 2, bar.position.y + signY * bar.height / 2, 0)
    }
    if (x > ball.radius || y > ball.radius) {
        distanceToBorder.copy(distanceToCenter);
        distanceToBorder.setLength(distanceToBorder.length() - ball.radius);
    }

    return [distanceToCenter, distanceToBorder, closestPoint];
}

export function ballWallCollisionDistances(ball: PhysicBall, gameWidth: number, gameHeight: number): Vector3[] {
    var distanceVectors = [];

    if (ball.position.x < ball.radius)
        distanceVectors.push(new Vector3(ball.position.x, 0));
    if (ball.position.x > gameWidth - ball.radius)
        distanceVectors.push(new Vector3(ball.position.x - gameWidth, 0));
    if (ball.position.y < ball.radius)
        distanceVectors.push(new Vector3(ball.position.y, 0));
    if (ball.position.y > gameHeight - ball.radius)
        distanceVectors.push(new Vector3(ball.position.y - gameHeight, 0));

    return distanceVectors;
}


