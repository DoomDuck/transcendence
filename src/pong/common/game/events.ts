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

// type BallOutArgs = [time: number, playerId: number];
// type BallOutCallback = (...args: BallOutArgs) => void;
// export class BallOutEvent {
//     static callbacks: BallOutCallback[];
//     static addCallback(callback: BallOutCallback) {
//         BallOutEvent.callbacks.push(callback);
//     }
//     static events: BallOutArgs[];
//     static produceEvent(...args: BallOutArgs) {
//         BallOutEvent.events.push(args);
//     }
//     static fireEvents() {
//         for (let event of BallOutEvent.events) {
//             for (let callback of BallOutEvent.callbacks) {
//                 callback(...event);
//             }
//         }
//     }
// }

// export function fireAllEvents() {
//     BallOutEvent.fireEvents();
// }


const allEventsCallbacks: Map<string, Function[]> = new Map();
export function registerEvent(name: string, callback: Function) {
    if (! allEventsCallbacks.has(name))
        allEventsCallbacks.set(name, [callback]);
    else
        allEventsCallbacks.get(name)?.push(callback);
}

const allEvents: Map<string, any[][]> = new Map();
export function produceEvent(name: string, ...args: any[]) {
    if (!allEvents.has(name))
        allEvents.set(name, [args]);
    else
        allEvents.get(name)?.push(args);
}

export function fireAllEvents() {
    for (let name of allEventsCallbacks.keys()) {
        allEvents.get(name)?.forEach((args: any[]) => {
            allEventsCallbacks.get(name)?.forEach((callback: Function) => callback(...args));
        })
        allEvents.set(name, []);
    }

}