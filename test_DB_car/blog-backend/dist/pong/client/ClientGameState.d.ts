import { GameState, PlayerID } from "../common";
import { ClientBall } from "./ClientBall";
import { ClientBar } from "./ClientBar";
export declare class ClientGameState extends GameState {
    playerId: PlayerID;
    playerDirection: number;
    constructor(ball: ClientBall, bar1: ClientBar, bar2: ClientBar, playerId: PlayerID);
    onReceiveSetBall(x: number, y: number, vx: number, vy: number, time: number): void;
    update(elapsed: number): void;
}
