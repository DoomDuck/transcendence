import { Vector3 } from "three";
import { PlayerID } from "../../common/constants";
import { Bar } from "./Bar";
export declare class Ball {
    radius: number;
    position: Vector3;
    speed: Vector3;
    wallCollided: boolean;
    outOfScreenAlreadyReported: boolean;
    constructor();
    reset(x: number, y: number, vx: number, vy: number): void;
    topY(): number;
    bottomY(): number;
    rightX(): number;
    leftX(): number;
    setTopY(y: number): void;
    setBottomY(y: number): void;
    gotOutOfScreen(): boolean;
    farthestPlayerSide(): PlayerID;
    update(elapsed: number, bars: [Bar, Bar]): void;
    handleBarCollision(bar: Bar): void;
    handleWallCollisions(): void;
    handleCollisions(bars: [Bar, Bar]): void;
}
