/**
 * This file is intended for functions not related to the pong specific features
 */

import { Vector3 } from "three";

const _v = new Vector3();

export function updateVectorDeltaT(v: Vector3, vspeed: Vector3, elapsed: number) {
    _v.copy(vspeed);
    _v.multiplyScalar(elapsed / 1000);
    v.add(_v);
}
