import { Vector3 } from "three";
import { Ball, Bar } from ".";
export interface CollisionData {
    distanceVec: Vector3;
    distance: number;
}
export interface BallBarCollisionData extends CollisionData {
    inside: boolean;
    corner: boolean;
    horizontal: boolean;
    vertical: boolean;
}
export interface CollisionResult {
    ignore: boolean;
    data: CollisionData;
}
export declare function ballBarCollisionDistanceData(ball: Ball, bar: Bar): BallBarCollisionData;
export declare function ballBarCollisionDetection(ball: Ball, bar: Bar): CollisionResult;
export declare function ballWallsCollisionDetection(ball: Ball): [CollisionResult, CollisionResult];
