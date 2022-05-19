import * as THREE from 'three'
import { Bar } from './Bar';
import { GSettings } from './constants';

export class LocalBar extends Bar {
    upKeys: string[];
    downKeys: string[];
    upPressed: boolean;
    downPressed: boolean;

    // collisionEdge: -1 for the left edge, +1 for the right edge
    constructor(collisionEdgeDirection: number) {
        super(collisionEdgeDirection);
        this.upKeys = ['ArrowUp'];
        this.downKeys = ['ArrowDown'];
        this.upPressed = false;
        this.downPressed = false;
    }

    setTopY(y: number) {
        this.position.y = y + this.height / 2;
    }

    setBottomY(y: number) {
        this.position.y = y - this.height / 2;
    }

    topY(): number {
        return this.position.y - this.height / 2;
    }

    bottomY(): number {
        return this.position.y + this.height / 2;
    }

    collisionEdgeX(): number {
        return this.position.x + this.collisionEdgeDirection * this.width / 2;
    }

    clipPosition() {
        if (this.topY() < GSettings.GAME_TOP)
            this.setTopY(GSettings.GAME_TOP);
        else if (this.bottomY() > GSettings.GAME_BOTTOM)
            this.setBottomY(GSettings.GAME_BOTTOM);
    }

    handleKeydown(e: KeyboardEvent) {
        if (this.upKeys.includes(e.key)) {
            this.upPressed = true;
        }
        else if (this.downKeys.includes(e.key)) {
            this.downPressed = true;
        }
    }

    handleKeyup(e: KeyboardEvent) {
        if (this.upKeys.includes(e.key)) {
            this.upPressed = false;
        }
        else if (this.downKeys.includes(e.key)) {
            this.downPressed = false;
        }
    }

    update(elapsedTime: number) {
        var speed = (+this.downPressed - +this.upPressed) * GSettings.BAR_SENSITIVITY;
        this.position.y += elapsedTime * speed / 1000;
        this.clipPosition();
    }
}
