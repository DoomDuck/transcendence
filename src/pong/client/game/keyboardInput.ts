import { Socket } from "socket.io-client";
import { DOWN, GameEvent, KeyValue, UP } from "../../common/constants";
import { GameState } from "../../common/entities";
import { BarInputEvent, type BarInputEventStruct } from "../../common/game/events";
import { ClientGameManager } from "./ClientGameManager";

// Offline
const P1_UPKEYS = ['e'];
const P1_DOWNKEYS = ['d'];
const P2_UPKEYS = ['ArrowUp'];
const P2_DOWNKEYS = ['ArrowDown'];
// Online
const UPKEYS = [...P1_UPKEYS, ...P2_UPKEYS];
const DOWNKEYS = [...P1_DOWNKEYS, ...P2_DOWNKEYS];

export function handleKeydownOffline(e: KeyboardEvent, state: GameState) {
    let barIdAndKey = barIdAndKeyFromEventOffline(e);
    if (barIdAndKey)
        state.registerEvent(new BarInputEvent(state.data.actualNow, barIdAndKey[0], barIdAndKey[1], true));
}
export function handleKeyupOffline(e: KeyboardEvent, state: GameState) {
    let barIdAndKey = barIdAndKeyFromEventOffline(e);
    if (barIdAndKey)
        state.registerEvent(new BarInputEvent(state.data.actualNow, barIdAndKey[0], barIdAndKey[1], false));
}

function barIdAndKeyFromEventOffline(e: KeyboardEvent): [number, KeyValue] | null {
    if (P1_UPKEYS.includes(e.key)) {
        return [0, UP];
    }
    else if (P1_DOWNKEYS.includes(e.key)) {
        return [0, DOWN];
    }
    else if (P2_UPKEYS.includes(e.key)) {
        return [1, UP];
    }
    else if (P2_DOWNKEYS.includes(e.key)) {
        return [1, DOWN];
    }
    else
        return null;
}

export function handleKeyOnline(e: KeyboardEvent, state: GameState, playerId: number, socket: Socket, pressed: boolean) {
    if (UPKEYS.includes(e.key)) {
        state.registerEvent(new BarInputEvent(state.data.actualNow, playerId, UP, pressed));
        socket.emit(GameEvent.SEND_BAR_EVENT, state.data.actualNow, playerId, UP, pressed);
        console.log(` -> sended ${state.data.actualNow}, ${playerId}, ${UP}, ${pressed}`);
    }
    else if (DOWNKEYS.includes(e.key)) {
        state.registerEvent(new BarInputEvent(state.data.actualNow, playerId, DOWN, pressed));
        socket.emit(GameEvent.SEND_BAR_EVENT, state.data.actualNow, playerId, DOWN, pressed);
        console.log(` -> sended ${state.data.actualNow}, ${playerId}, ${DOWN}, ${pressed}`);
    }
}

// export function handleKeydownOnline(e: KeyboardEvent, state: GameState, playerId: number, socket: Socket) {
//     let eventArgs: BarInputEventStruct;
//     if (UPKEYS.includes(e.key))
//         eventArgs = [state.data.actualNow, playerId, UP, true];
//     else if (DOWNKEYS.includes(e.key))
//         eventArgs = [state.data.actualNow, playerId, DOWN, true];
//     else
//         return;
//     state.registerEvent(new BarInputEvent(...eventArgs));
//     socket.emit(GameEvent.SEND_BAR_EVENT, ...eventArgs);
//     console.log(` -> sended ${eventArgs.map(toString).join(', ')}`);
// }

// export function handleKeyupOnline(e: KeyboardEvent, state: GameState, playerId: number, socket: Socket) {
//     let eventArgs: BarInputEventStruct;
//     if (UPKEYS.includes(e.key))
//         eventArgs = [state.data.actualNow, playerId, UP, false];
//     else if (DOWNKEYS.includes(e.key))
//         eventArgs = [state.data.actualNow, playerId, DOWN, false];
//     else
//         return;
//     state.registerEvent(new BarInputEvent(...eventArgs));
//     socket.emit(GameEvent.SEND_BAR_EVENT, ...eventArgs);
//     console.log(` -> sended ${eventArgs.map((x: any) => `${x}`).join(', ')}`);
// }