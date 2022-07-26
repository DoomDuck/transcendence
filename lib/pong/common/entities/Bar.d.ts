import { Vector3 } from "three";
import { KeyValue, PlayerID } from "../constants";
export declare class Bar {
    width: number;
    height: number;
    collisionEdgeDirection: number;
    position: Vector3;
    upPressed: boolean;
    downPressed: boolean;
    constructor(playerId: PlayerID);
    reset(): void;
    setTopY(y: number): void;
    setBottomY(y: number): void;
    topY(): number;
    bottomY(): number;
    clipPosition(): void;
    onReceiveKeydown(keyValue: KeyValue, emitTime: number): void;
    onReceiveKeyup(keyValue: KeyValue, y: number): void;
    onReceivePosition(y: number): void;
    speed(): number;
    update(elapsed: number): void;
}
