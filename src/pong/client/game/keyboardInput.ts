import { DOWN, KeyValue, UP } from "../../common/constants";
import { GameState } from "../../common/entities";
import { BarInputEvent } from "../../common/game/events";

const P1_UPKEYS = ['a'];
const P1_DOWNKEYS = ['q'];
const P2_UPKEYS = ['ArrowUp'];
const P2_DOWNKEYS = ['ArrowDown'];

export function handleKeydown(e: KeyboardEvent, state: GameState) {
    let keyBarId = keyAndBarIdFromEvent(e);
    if (keyBarId)
        state.registerEvent(new BarInputEvent(state.data.now, keyBarId[1], keyBarId[0], true));
}
export function handleKeyup(e: KeyboardEvent, state: GameState) {
    let keyBarId = keyAndBarIdFromEvent(e);
    if (keyBarId)
        state.registerEvent(new BarInputEvent(state.data.now, keyBarId[1], keyBarId[0], false));
}

function keyAndBarIdFromEvent(e: KeyboardEvent): [KeyValue, number] | null {
    if (P1_UPKEYS.includes(e.key)) {
        return [UP, 0];
    }
    else if (P1_DOWNKEYS.includes(e.key)) {
        return [DOWN, 0];
    }
    else if (P2_UPKEYS.includes(e.key)) {
        return [UP, 1];
    }
    else if (P2_DOWNKEYS.includes(e.key)) {
        return [DOWN, 1];
    }
    else
        return null;
}