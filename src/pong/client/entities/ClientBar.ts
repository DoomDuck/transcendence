import { Bar } from '../../common/entities';
import { GSettings, KeyValue, PlayerID, GameEvent } from '../../common/constants';
import { BarMesh } from '../graphic';

/**
 * Each of the two bars part of a game instance on the client side (ClientGame).
 * Adds display capability to Bar.
 * Also can sent keyboard events (up or down) if it is being controled by the client
 * (i.e. its playerId matches the playerId of the ClientGame).
 */
export class ClientBar extends Bar {
    mesh: BarMesh;

    constructor(playerId: PlayerID) {
        super(playerId);
        this.mesh = new BarMesh();
        this.position = this.mesh.position;
        this.reset();
    }

    handleKeydown(e: KeyboardEvent, emitFunction: (event: string, ...args: any[]) => void) {
        if (GSettings.BAR_UP_KEYS.includes(e.key)) {
            if (this.upPressed)
                return;
            this.upPressed = true;
            emitFunction(GameEvent.SEND_BAR_KEYDOWN, KeyValue.UP, Date.now());
        }
        else if (GSettings.BAR_DOWN_KEYS.includes(e.key)) {
            if (this.downPressed)
                return;
            this.downPressed = true;
            emitFunction(GameEvent.SEND_BAR_KEYDOWN, KeyValue.DOWN, Date.now());
        }
    }

    handleKeyup(e: KeyboardEvent, emitFunction: (event: string, ...args: any[]) => void) {
        if (GSettings.BAR_UP_KEYS.includes(e.key)) {
            this.upPressed = false;
            emitFunction(GameEvent.SEND_BAR_KEYUP, KeyValue.UP, this.position.y);
        }
        else if (GSettings.BAR_DOWN_KEYS.includes(e.key)) {
            this.downPressed = false;
            emitFunction(GameEvent.SEND_BAR_KEYUP, KeyValue.DOWN, this.position.y);
        }
    }
}
