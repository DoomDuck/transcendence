import { EventEmitter } from 'events';
import { Vector3 } from 'three';
import { GameEvent, GSettings, KeyValue, LEFT, PLAYER1, PLAYER2, PlayerID, RIGHT } from './constants';

export class Bar extends EventEmitter {
    width: number;
    height: number;
    collisionEdgeDirection: number;
    position: Vector3;
    upPressed: boolean;
    downPressed: boolean;


    constructor(playerId: PlayerID) {
        super();
        this.width = GSettings.BAR_WIDTH;
        this.height = GSettings.BAR_HEIGHT;
        this.collisionEdgeDirection = (playerId == PLAYER1) ? RIGHT : LEFT;
        this.position = new Vector3();
        this.upPressed = false;
        this.downPressed = false;
        ///
        // this.on(GameEvent.BAR_KEYDOWN, this.onReceiveKeydown.bind(this));
        // this.on(GameEvent.BAR_KEYUP, this.onReceiveKeyup.bind(this));
        // this.on(GameEvent.BAR_POSITION, this.onReceiveKeyup.bind(this));
    }

    reset() {
        this.position.set(
            -this.collisionEdgeDirection * GSettings.BAR_INITIALX,
            GSettings.BAR_INITIALY,
            0
        )
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

    clipPosition() {
        if (this.topY() < GSettings.GAME_TOP)
            this.setTopY(GSettings.GAME_TOP);
        else if (this.bottomY() > GSettings.GAME_BOTTOM)
            this.setBottomY(GSettings.GAME_BOTTOM);
    }

    onReceiveKeydown(keyValue: KeyValue, emitTime: number) {
        console.log('received keydown');
        let delta = Date.now() - emitTime;
        // console.log(`keyup receive delta = ${delta}`);
        if (keyValue == KeyValue.UP) {
            this.position.y -= delta * GSettings.BAR_SENSITIVITY / 1000;
            this.upPressed = true;
        }
        else {
            this.position.y += delta * GSettings.BAR_SENSITIVITY / 1000;
            this.downPressed = true;
        }
        this.clipPosition();
        // console.log(`bar ${this.collisionEdgeDirection == RIGHT ? PLAYER1 : PLAYER2} received the event 'receiveKeydown' with parameters (keyValue, emitTime) = ${keyValue}, ${emitTime}`)
    }

    onReceiveKeyup(keyValue: KeyValue, y: number) {
        if (keyValue == KeyValue.UP) {
            this.upPressed = false;
        }
        else {
            this.downPressed = false;
        }
        this.position.y = y;
        // console.log(`bar ${this.collisionEdgeDirection == RIGHT ? PLAYER1 : PLAYER2} received the event 'receiveKeyup' with parameter keyValue = ${keyValue}, y = ${y}`)
    }

    onReceivePosition(y: number) {
        this.position.y = y;
        // console.log(`bar ${this.collisionEdgeDirection == RIGHT ? PLAYER1 : PLAYER2} received the event 'receivePosition' with parameter keyValue = ${keyValue}, y = ${y}`)
    }

    speed() {
        return (+this.downPressed - +this.upPressed) * GSettings.BAR_SENSITIVITY;
    }

    update(elapsed: number) {
        this.position.y += elapsed * this.speed() / 1000;
        this.clipPosition();
    }

}
