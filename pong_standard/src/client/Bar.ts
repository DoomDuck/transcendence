import * as THREE from 'three'
import { GSettings } from './constants';

export class Bar extends THREE.Mesh {
    width: number;
    height: number;
    upKeys: string[];
    downKeys: string[];
    frontDirection: number;
    upPressed: boolean;
    downPressed: boolean;

    // collisionEdge: -1 for the left edge, +1 for the right edge
    constructor(width: number, height: number, x: number, y: number, collisionEdgeDirection: number) {
        const geometry = new THREE.BoxGeometry(
            width, height
        );
        const material = new THREE.MeshBasicMaterial({
            color: 0xd14081,
        });
        super(geometry, material)
        this.width = width;
        this.height = height;
        this.position.x = x;
        this.position.y = y;
        this.frontDirection = collisionEdgeDirection;
        this.upKeys = ['ArrowUp'];
        this.downKeys = ['ArrowDown'];
        this.upPressed = false
        this.downPressed = false
    }

    setTop(y: number) {
        this.position.y = y + this.height / 2;
    }

    setBottom(y: number) {
        this.position.y = y - this.height / 2;
    }

    top(): number {
        return this.position.y - this.height / 2;
    }

    bottom(): number {
        return this.position.y + this.height / 2;
    }

    front(): number {
        return this.position.x + this.frontDirection * this.width / 2;
    }

    back(): number {
        return this.position.x - this.frontDirection * this.width / 2;
    }

    clipPosition() {
        if (this.top() < GSettings.GAME_TOP)
            this.setTop(GSettings.GAME_TOP);
        else if (this.bottom() > GSettings.GAME_BOTTOM)
            this.setBottom(GSettings.GAME_BOTTOM);
    }

    keydownHandler(e: KeyboardEvent) {
        if (this.upKeys.includes(e.key)) {
            this.upPressed = true;
        }
        else if (this.downKeys.includes(e.key)) {
            this.downPressed = true;
        }
    }

    keyupHandler(e: KeyboardEvent) {
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
