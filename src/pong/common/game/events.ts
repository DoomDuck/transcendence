import { KeyValue } from "../constants";
import { DataBuffer } from "../entities/data";
import { Game } from "./Game";

export interface ExternEvent {
    time: number;
    process(data: DataBuffer): void;
}

export class BarInputEvent implements ExternEvent {
    constructor(public time: number, public barId: number, public key: KeyValue, public pressed: boolean) {}

    // for now ignore time ...
    process(data: DataBuffer) {
        if (this.key == KeyValue.UP)
            data.barsNow[this.barId].upPressed = this.pressed;
        else
            data.barsNow[this.barId].downPressed = this.pressed;
    }
}

type Callback = (...args: any[]) => any;
export interface InternEvent {
    callbacks: Callback[];
}

export class BallOutEvent {
    static callbacks: Callback[]
    constructor(public time: number, public playerId: number) {}
}