/**
 * Utility functions
 */

import { GSettings } from "./constants";

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

export function randomGravitonCoords(): [number, number] {
  return [
    GSettings.GRAVITON_SPAWN_WIDTH * (Math.random() - 0.5),
    GSettings.GRAVITON_SPAWN_HEIGHT * (Math.random() - 0.5),
  ];
}

function rangedRandomValue(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function randomPortalCoords(): [number, number, number, number] {
  return [
    -rangedRandomValue(
      GSettings.PORTAL_SPAWN_XMIN,
      GSettings.PORTAL_SPAWN_XMAX
    ),
    rangedRandomValue(GSettings.PORTAL_SPAWN_XMIN, GSettings.PORTAL_SPAWN_XMAX),
    GSettings.PORTAL_SPAWN_HEIGHT * (Math.random() - 0.5),
    GSettings.PORTAL_SPAWN_HEIGHT * (Math.random() - 0.5),
  ];
}

export function staticImplements<T>() {
  return <U extends T>(constructor: U) => {
    constructor;
  };
}
