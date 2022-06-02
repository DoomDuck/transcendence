/// <reference types="node" />
import { Vector3 } from 'three';
import { Bar } from './Bar';
import { EventEmitter } from "events";
export declare class Ball extends EventEmitter {
    radius: number;
    position: Vector3;
    speed: Vector3;
    wallCollided: boolean;
    constructor();
    reset(x: number, y: number, vx: number, vy: number): void;
    topY(): number;
    bottomY(): number;
    rightX(): number;
    leftX(): number;
    setTopY(y: number): void;
    setBottomY(y: number): void;
    updatePosition(elapsedTime: number): void;
    update(elapsedTime: number): void;
    handleBarCollision(bar: Bar): void;
    handleWallCollisions(): void;
    handleCollisions(bars: [Bar, Bar]): void;
    handleReceiveSetBall(x: number, y: number, vx: number, vy: number): void;
}
