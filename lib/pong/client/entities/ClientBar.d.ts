import { Bar } from "../../common/entities";
import { PlayerID } from "../../common/constants";
import { BarMesh } from "../graphic";
export declare class ClientBar extends Bar {
    mesh: BarMesh;
    constructor(playerId: PlayerID);
    handleKeydown(e: KeyboardEvent, emitFunction: (event: string, ...args: any[]) => void): void;
    handleKeyup(e: KeyboardEvent, emitFunction: (event: string, ...args: any[]) => void): void;
}
