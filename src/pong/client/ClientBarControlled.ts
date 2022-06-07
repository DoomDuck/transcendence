import { ClientBar } from './ClientBar';
import { GSettings, KeyValue, PlayerID } from '../common/constants';
import { GameEvent } from '../common';

export class ClientBarControlled extends ClientBar {
    upKeys: string[];
    downKeys: string[];

    constructor(playerId: PlayerID) {
        super(playerId);
        this.upKeys = ['ArrowUp'];
        this.downKeys = ['ArrowDown'];
        window.addEventListener('keydown', this.handleKeydown.bind(this), false);
        window.addEventListener('keyup', this.handleKeyup.bind(this), false);
    }

    collisionEdgeX(): number {
        return this.position.x + this.collisionEdgeDirection * this.width / 2;
    }

    handleKeydown(e: KeyboardEvent) {
        if (this.upKeys.includes(e.key)) {
            if (this.upPressed)
                return;
            this.upPressed = true;
            this.emit(GameEvent.SEND_BAR_KEYDOWN, KeyValue.UP, Date.now());
        }
        else if (this.downKeys.includes(e.key)) {
            if (this.downPressed)
                return;
            this.downPressed = true;
            this.emit(GameEvent.SEND_BAR_KEYDOWN, KeyValue.DOWN, Date.now());
        }
    }

    handleKeyup(e: KeyboardEvent) {
        if (this.upKeys.includes(e.key)) {
            this.upPressed = false;
            this.emit(GameEvent.SEND_BAR_KEYUP, KeyValue.UP, this.position.y);
        }
        else if (this.downKeys.includes(e.key)) {
            this.downPressed = false;
            this.emit(GameEvent.SEND_BAR_KEYUP, KeyValue.DOWN, this.position.y);
        }
    }
}
