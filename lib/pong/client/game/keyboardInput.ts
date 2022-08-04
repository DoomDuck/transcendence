/**
 * Callbacks for the listening of keyboard events, i.e. for the players to control the bar(s).
 */

import { Socket } from "socket.io-client";
import {
  DOWN,
  GameEvent,
  GSettings,
  KeyValue,
  UP,
} from "../../common/constants";
import { GameState } from "../../common/entities";
import { Game } from "../../common/game";
import { BarInputEvent } from "../../common/game/events";

export function handleKeydownOffline(e: KeyboardEvent, state: GameState) {
  let barIdAndKey = barIdAndKeyFromEventOffline(e);
  if (barIdAndKey)
    state.registerEvent(
      new BarInputEvent(
        state.data.actualNow,
        barIdAndKey[0],
        barIdAndKey[1],
        true
      )
    );
}
export function handleKeyupOffline(e: KeyboardEvent, state: GameState) {
  let barIdAndKey = barIdAndKeyFromEventOffline(e);
  if (barIdAndKey)
    state.registerEvent(
      new BarInputEvent(
        state.data.actualNow,
        barIdAndKey[0],
        barIdAndKey[1],
        false
      )
    );
}

function barIdAndKeyFromEventOffline(
  e: KeyboardEvent
): [number, KeyValue] | null {
  if (GSettings.BAR_P1_UPKEYS.includes(e.key)) {
    return [0, UP];
  } else if (GSettings.BAR_P1_DOWNKEYS.includes(e.key)) {
    return [0, DOWN];
  } else if (GSettings.BAR_P2_UPKEYS.includes(e.key)) {
    return [1, UP];
  } else if (GSettings.BAR_P2_DOWNKEYS.includes(e.key)) {
    return [1, DOWN];
  } else return null;
}

export function handleKeyOnline(
  e: KeyboardEvent,
  state: GameState,
  playerId: number,
  socket: Socket,
  pressed: boolean
) {
  if (GSettings.BAR_UPKEYS.includes(e.key)) {
    state.registerEvent(
      new BarInputEvent(state.data.actualNow, playerId, UP, pressed)
    );
    socket.emit(
      GameEvent.SEND_BAR_EVENT,
      state.data.actualNow,
      playerId,
      UP,
      pressed
    );
    console.log(
      ` -> sended ${state.data.actualNow}, ${playerId}, ${UP}, ${pressed}`
    );
  } else if (GSettings.BAR_DOWNKEYS.includes(e.key)) {
    state.registerEvent(
      new BarInputEvent(state.data.actualNow, playerId, DOWN, pressed)
    );
    socket.emit(
      GameEvent.SEND_BAR_EVENT,
      state.data.actualNow,
      playerId,
      DOWN,
      pressed
    );
    console.log(
      ` -> sended ${state.data.actualNow}, ${playerId}, ${DOWN}, ${pressed}`
    );
  }
}

export function setupKeyboardOffline(game: Game) {
  window.addEventListener(
    "keydown",
    (e: KeyboardEvent) => handleKeydownOffline(e, game.state),
    false
  );
  window.addEventListener(
    "keyup",
    (e: KeyboardEvent) => handleKeyupOffline(e, game.state),
    false
  );
}

export function setupKeyboardOnline(
  game: Game,
  playerId: number,
  socket: Socket
) {
  window.addEventListener(
    "keydown",
    (e: KeyboardEvent) =>
      handleKeyOnline(e, game.state, playerId, socket, true),
    false
  );
  window.addEventListener(
    "keyup",
    (e: KeyboardEvent) =>
      handleKeyOnline(e, game.state, playerId, socket, false),
    false
  );
}
