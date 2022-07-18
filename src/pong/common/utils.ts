/**
 * This file is intended for functions not specific to pong
 */

export function delay(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

export function removeElementByValue<T>(array: T[], item: T) {
  let index = array.indexOf(item);
  if (index !== -1) array.splice(index, 1);
}

export class Vector2 {
  constructor(public x: number = 0, public y: number = 0) {}
  add(v: Vector2) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }
}
