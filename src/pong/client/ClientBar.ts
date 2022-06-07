import * as THREE from 'three'
import { Vector3 } from 'three';
import { Bar } from '../common/Bar';
import { GameEvent, GSettings, KeyValue, PlayerID } from '../common/constants';

export class ClientBar extends Bar {
    mesh: THREE.Mesh;

    constructor(playerId: PlayerID, options: any) {
        super(playerId);
        const geometry = new THREE.BoxGeometry(
            GSettings.BAR_WIDTH, GSettings.BAR_HEIGHT
        );
        const material = new THREE.MeshBasicMaterial({
            color: 0xd14081,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.position = this.mesh.position;
        this.reset();
        
        if (options['controllable']) {
            window.addEventListener('keydown', this.handleKeydown.bind(this), false);
            window.addEventListener('keyup', this.handleKeyup.bind(this), false);
        }
    }

    collisionEdgeX(): number {
        return this.position.x + this.collisionEdgeDirection * this.width / 2;
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
