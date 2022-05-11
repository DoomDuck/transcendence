import * as THREE from 'three'
import { Vector3 } from 'three';
import { GSettings } from './constants';
import { Bar } from './Bar';

var _delta = new Vector3();

export class Ball extends THREE.Mesh {
    radius: number
    speed: Vector3
    onGoal: (playerId: number) => void

    constructor(radius: number, x: number, y: number, speedX: number, speedY: number, onGoal: (playerId: number) => void) {

        const geometry = new THREE.CylinderGeometry(
            radius, radius, 1, GSettings.BALL_RADIAL_SEGMENTS,
        )
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        })
        super(geometry, material);
        this.rotateX(THREE.MathUtils.degToRad(90));
        this.position.x = x;
        this.position.y = y;
        this.radius = radius;
        this.speed = new Vector3(speedX, speedY);
        this.onGoal = onGoal;
    }

    updatePosition(elapsedTime: number) {
        _delta.copy(this.speed);
        _delta.multiplyScalar(elapsedTime / 1000);
        this.position.add(_delta);
    }

    handleBarCollision(bar: Bar) {
        // detection
        var deltaX = this.position.x - bar.collisionEdgeX();
        deltaX *= bar.collisionEdgeDirection
        if (deltaX < 0 || deltaX > this.radius)
            return;
        var deltaY = this.position.y - bar.position.y;
        if (Math.abs(deltaY) > bar.height / 2)
            return;

        // resolution
        this.position.x = this.radius * bar.collisionEdgeDirection + bar.collisionEdgeX();
        this.speed.x *= -1;
        this.speed.x += Math.sign(this.speed.x) * GSettings.BALL_SPEEDX_INCREASE;
        if (Math.abs(this.speed.x) > GSettings.BALL_SPEEDX_MAX)
            this.speed.x = Math.sign(this.speed.x) * GSettings.BALL_SPEEDX_MAX;
        this.speed.y += (deltaY / bar.height) * GSettings.BALL_SPEEDY_GAIN_MAX;
    }

    handleWallCollisions() {
        if (this.position.y < GSettings.GAME_TOP || this.position.y > GSettings.GAME_BOTTOM) {
            this.speed.y *= -1;
        }
        else if (this.position.x < GSettings.GAME_LEFT) {
            this.onGoal(0);
        }
        else if (this.position.x > GSettings.GAME_RIGHT) {
            this.onGoal(1);
        }
    }

    update(elapsedTime: number) {
        this.updatePosition(elapsedTime);
    }
}
