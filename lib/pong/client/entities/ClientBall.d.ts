import { Ball, Bar } from "../../common/entities";
import { PlayerID } from "../../common/constants";
import { BallMesh } from "../graphic";
import { Vector3 } from "three";
export declare class ClientBall extends Ball {
    mesh: BallMesh;
    playerId: PlayerID;
    serverPosition: Vector3;
    serverSpeed: Vector3;
    constructor(playerId: PlayerID);
    reset(x: number, y: number, vx: number, vy: number): void;
    changeColorAtLimit(): void;
    handleReceiveSetBall(x: number, y: number, vx: number, vy: number, time: number): void;
    update(elapsed: number, bars: [Bar, Bar]): void;
}
