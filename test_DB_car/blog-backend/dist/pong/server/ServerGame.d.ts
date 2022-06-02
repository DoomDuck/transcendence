/// <reference types="node" />
import { Game } from "../common/Game";
export declare class ServerGame extends Game {
    timeOutHandle: NodeJS.Timeout;
    stepsAccumulated: number;
    constructor();
}
