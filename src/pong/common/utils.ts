/**
 * Utility functions
 */

import { GameEvent, GSettings } from "./constants";
import { Game } from "./game";

export function delay(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}
  add(v: Vector2) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
}

export function spawnRandomGraviton(game: Game) {
  let x = GSettings.GRAVITON_SPAWN_WIDTH * (Math.random() - 0.5);
  let y = GSettings.GRAVITON_SPAWN_HEIGHT * (Math.random() - 0.5);
  game.emit(
    GameEvent.SPAWN_GRAVITON,
    game.state.data.actualNow,
    x,
    y,
    GSettings.GRAVITON_LIFESPAN
  );
}

function rangedRandomValue(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function spawnRandomPortal(game: Game) {
  let x1 = -rangedRandomValue(
    GSettings.PORTAL_SPAWN_XMIN,
    GSettings.PORTAL_SPAWN_XMAX
  );
  let x2 = rangedRandomValue(
    GSettings.PORTAL_SPAWN_XMIN,
    GSettings.PORTAL_SPAWN_XMAX
  );
  let y1 = GSettings.PORTAL_SPAWN_HEIGHT * (Math.random() - 0.5);
  let y2 = GSettings.PORTAL_SPAWN_HEIGHT * (Math.random() - 0.5);
  game.emit(
    GameEvent.SPAWN_PORTAL,
    game.state.data.actualNow,
    x1,
    y1,
    x2,
    y2,
    GSettings.PORTAL_LIFESPAN
  );
}
