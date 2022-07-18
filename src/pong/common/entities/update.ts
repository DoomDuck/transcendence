import { GSettings } from "../constants";
import { Vector2 } from "../utils";
import { clipBallSpeedX, clipBallSpeedY } from "./collisions";
import { DataBuffer, GravitonData } from "./data";
import { collisions } from "./collisions";

export function processExternEvents(data: DataBuffer) {
  if (data.eventsNow !== null) {
    for (let dataChanger of data.eventsNow) {
      dataChanger(data);
    }
  }
}

export function propagateBarInputs(data: DataBuffer) {
  data.barsNext[0].copyKeysState(data.barsCurrent[0]);
  data.barsNext[1].copyKeysState(data.barsCurrent[1]);
}

// propagate graviton existance / death
export function updateGravitons(data: DataBuffer) {
  data.gravitonsNext.clear();
  data.gravitonsCurrent.forEach((graviton) => {
    if (graviton.age < GSettings.GRAVITON_LIFESPAN) {
      let gravitonNext = Object.assign({}, graviton);
      gravitonNext.age++;
      data.gravitonsNext.add(gravitonNext);
    }
  });
}

export function updatePortal(data: DataBuffer) {
  data.portalsNext.clear();
  data.portalsCurrent.forEach((portal) => {
    if (portal.age < GSettings.PORTAL_LIFESPAN) {
      let portalNext = Object.assign({}, portal);
      portalNext.age++;
      data.portalsNext.add(portalNext);
    }
  });
}

export function applyForces(data: DataBuffer) {
  let resultForce = Array.from(data.gravitonsCurrent.values())
    .map((graviton) => computeForce(data, graviton))
    .reduce(
      (totalForce, currentForce) => totalForce.add(currentForce),
      new Vector2()
    );
  data.ballNext.vx =
    data.ballCurrent.vx + GSettings.GAME_STEP_S * resultForce.x;
  data.ballNext.vy =
    data.ballCurrent.vy + GSettings.GAME_STEP_S * resultForce.y;
  clipBallSpeedX(data.ballNext);
  clipBallSpeedY(data.ballNext);
}

export function computeForce(
  data: DataBuffer,
  graviton: GravitonData
): Vector2 {
  let dx = Math.abs(data.ballCurrent.x - graviton.x);
  if (dx > GSettings.GRAVITON_FORCE_WIDTH_HALF) return new Vector2();
  let mx = Math.sqrt(1 - dx / GSettings.GRAVITON_FORCE_WIDTH_HALF);
  let d =
    (data.ballCurrent.y - graviton.y) / GSettings.GRAVITON_FORCE_HEIGHT_HALF;
  let dSign = Math.sign(d);
  let my = dSign / (1 + dSign * d);
  return new Vector2(0, -mx * my * GSettings.GRAVITON_MAX_FORCE);
}

export function applySpeed(data: DataBuffer) {
  data.ballNext.x =
    data.ballCurrent.x + GSettings.GAME_STEP_S * data.ballNext.vx;
  data.ballNext.y =
    data.ballCurrent.y + GSettings.GAME_STEP_S * data.ballNext.vy;
  data.barsNext[0].y =
    data.barsCurrent[0].y + GSettings.GAME_STEP_S * data.barsNext[0].vy;
  data.barsNext[1].y =
    data.barsCurrent[1].y + GSettings.GAME_STEP_S * data.barsNext[1].vy;
}
