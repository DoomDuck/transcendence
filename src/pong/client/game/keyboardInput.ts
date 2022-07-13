import { DOWN, KeyValue, PlayerID, UP } from "../../common/constants";
import { GameState } from "../../common/entities";
import { BarInputEvent } from "../../common/game/events";

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
        state.registerEvent(new BarInputEvent(state.data.now, barIdAndKey[0], barIdAndKey[1], true));
}
export function handleKeyupOffline(e: KeyboardEvent, state: GameState) {
    let barIdAndKey = barIdAndKeyFromEventOffline(e);
    if (barIdAndKey)
        state.registerEvent(new BarInputEvent(state.data.now, barIdAndKey[0], barIdAndKey[1], false));
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

export function handleKeydownOnline(e: KeyboardEvent, state: GameState, playerId: PlayerID) {
    if (UPKEYS.includes(e.key))
        state.registerEvent(new BarInputEvent(state.data.now, playerId, UP, true));
    else if (DOWNKEYS.includes(e.key))
        state.registerEvent(new BarInputEvent(state.data.now, playerId, DOWN, true));
}

export function handleKeyupOnline(e: KeyboardEvent, state: GameState, playerId: PlayerID) {
    if (UPKEYS.includes(e.key))
        state.registerEvent(new BarInputEvent(state.data.now, playerId, UP, false));
    else if (DOWNKEYS.includes(e.key))
        state.registerEvent(new BarInputEvent(state.data.now, playerId, DOWN, false));
}