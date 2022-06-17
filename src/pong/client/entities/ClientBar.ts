import { Bar } from '../../common/entities';
import { GameEvent, GSettings, KeyValue, PlayerID } from '../../common/constants';
import { BarMesh } from '../graphic';

/**
 * Each of the two bars part of a game instance on the client side (ClientGame).
 * Adds display capability to Bar.
 * Also can sent keyboard events (up or down) if it is being controled by the client
 * (i.e. its playerId matches the playerId of the ClientGame).
 */
export class ClientBar extends Bar {
    mesh: BarMesh;

    constructor(playerId: PlayerID, options: any) {
        super(playerId);
        this.mesh = new BarMesh();
        this.position = this.mesh.position;
        this.reset();

        if (options['controllable']) {
            window.addEventListener('keydown', this.handleKeydown.bind(this), false);
            window.addEventListener('keyup', this.handleKeyup.bind(this), false);
        }
    }

    handleKeydown(e: KeyboardEvent) {
        if (GSettings.BAR_UP_KEYS.includes(e.key)) {
            if (this.upPressed)
                return;
            this.upPressed = true;
            this.emit(GameEvent.SEND_BAR_KEYDOWN, KeyValue.UP, Date.now());
        }
        else if (GSettings.BAR_DOWN_KEYS.includes(e.key)) {
            if (this.downPressed)
                return;
            this.downPressed = true;
            this.emit(GameEvent.SEND_BAR_KEYDOWN, KeyValue.DOWN, Date.now());
        }
    }

    handleKeyup(e: KeyboardEvent) {
        if (GSettings.BAR_UP_KEYS.includes(e.key)) {
            this.upPressed = false;
            this.emit(GameEvent.SEND_BAR_KEYUP, KeyValue.UP, this.position.y);
        }
        else if (GSettings.BAR_DOWN_KEYS.includes(e.key)) {
            this.downPressed = false;
            this.emit(GameEvent.SEND_BAR_KEYUP, KeyValue.DOWN, this.position.y);
        }
    }
}
