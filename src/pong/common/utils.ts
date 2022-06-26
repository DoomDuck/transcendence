/**
 * This file is intended for functions not specific to pong
 */

import { Vector3 } from "three";

const _v = new Vector3();

export function updateVectorDeltaT(v: Vector3, vspeed: Vector3, elapsed: number) {
    _v.copy(vspeed);
    _v.multiplyScalar(elapsed / 1000);
    v.add(_v);
}

export function delay(duration: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

export function removeElementByValue<T>(array: T[], item: T) {
    let index = array.indexOf(item);
    if (index !== -1)
        array.splice(index, 1);
}