import { Game } from "../../common/game";
export declare class ServerGame extends Game {
    constructor();
    emitBallPosition(): void;
    testGoal(): void;
    update(elapsed: number): void;
}
