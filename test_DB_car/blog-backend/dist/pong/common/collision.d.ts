import { Vector3 } from 'three';
import { Ball } from './Ball';
import { Bar } from './Bar';
export declare type CollisionResultType = {
    inside: boolean;
    corner: boolean;
    horizontal: boolean;
    vertical: boolean;
    distanceVec: Vector3;
};
export declare function ballBarCollision(ball: Ball, bar: Bar): CollisionResultType;
