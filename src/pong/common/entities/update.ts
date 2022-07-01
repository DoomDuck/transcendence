import { GSettings } from "../constants";
import { Vector2 } from "../utils";
import { clipBallSpeedX, clipBallSpeedY } from "./collisions";
import { DataBuffer, GravitonData } from "./data";
import { collisions } from "./collisions";

export function updateOneStep(data: DataBuffer) {
    processExternEvents(data);
    propagateBarInputs(data);
    updateGravitons(data);
    applyForces(data);
    applySpeed(data);
    collisions(data);
    data.advance();
}

function processExternEvents(data: DataBuffer) {
    for (let event of data.eventsNow) {
        event.process(data);
    }
    data.eventsThen.splice(0, data.eventsThen.length);
}

function propagateBarInputs(data: DataBuffer) {
    data.barsThen[0].copyKeysState(data.barsNow[0]);
    data.barsThen[1].copyKeysState(data.barsNow[1]);
}

// propagate graviton existance / death
function updateGravitons(data: DataBuffer) {
    data.gravitonsThen.clear();
    data.gravitonsNow.forEach((graviton) => {
        if (graviton.age < GSettings.GRAVITON_LIFESPAN) {
            let gravitonThen = GravitonData.clone(graviton);
            gravitonThen.age++;
            data.gravitonsThen.add(gravitonThen);
        }
    })
}

function applyForces(data: DataBuffer) {
    let resultForce = Array.from(data.gravitonsNow.values())
        .map((graviton) => computeForce(data, graviton))
        .reduce((totalForce, currentForce) => totalForce.add(currentForce), new Vector2());
    data.ballThen.vx = data.ballNow.vx + GSettings.GAME_STEP_S * resultForce.x;
    data.ballThen.vy = data.ballNow.vy + GSettings.GAME_STEP_S * resultForce.y;
    clipBallSpeedX(data.ballThen);
    clipBallSpeedY(data.ballThen);
}

function computeForce(data: DataBuffer, graviton: GravitonData): Vector2 {
    let dx = Math.abs(data.ballNow.x - graviton.x);
    if (dx > GSettings.GRAVITON_FORCE_WIDTH_HALF)
        return new Vector2();
    let mx = Math.sqrt(1 - dx / GSettings.GRAVITON_FORCE_WIDTH_HALF);
    let d = (data.ballNow.y - graviton.y) / GSettings.GRAVITON_FORCE_HEIGHT_HALF;
    let dSign = Math.sign(d);
    let my = dSign / (1 + dSign * d);
    return new Vector2(0, - mx * my * GSettings.GRAVITON_MAX_FORCE);
}

function applySpeed(data: DataBuffer) {
    data.ballThen.x = data.ballNow.x + GSettings.GAME_STEP_S * data.ballThen.vx;
    data.ballThen.y = data.ballNow.y + GSettings.GAME_STEP_S * data.ballThen.vy;
    data.barsThen[0].y = data.barsNow[0].y + GSettings.GAME_STEP_S * data.barsThen[0].vy;
    data.barsThen[1].y = data.barsNow[1].y + GSettings.GAME_STEP_S * data.barsThen[1].vy;
}
