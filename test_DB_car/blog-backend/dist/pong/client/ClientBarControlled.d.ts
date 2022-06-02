import { ClientBar } from './ClientBar';
import { PlayerID } from '../common/constants';
export declare class ClientBarControlled extends ClientBar {
    upKeys: string[];
    downKeys: string[];
    constructor(playerId: PlayerID);
    collisionEdgeX(): number;
    handleKeydown(e: KeyboardEvent): void;
    handleKeyup(e: KeyboardEvent): void;
}
