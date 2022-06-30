import { fireAllEvents, type ExternEvent } from "../game/events";
import { GSettings } from "../constants";
import { Vector2 } from "../utils";
import { collisions } from "./collisions";
import { DataBuffer, GravitonData } from "./data";

export class GameState {
    data: DataBuffer = new DataBuffer();
    events: ExternEvent[] = [];

    registerEvent(event: ExternEvent) {
        this.events.push(event);
    }

    update() {
        for (let event of this.events) {
            event.process(this.data);
        }
        this.events = [];
        propagateBarInputs(this.data);
        updateGravitons(this.data);
        applyForces(this.data);
        applySpeed(this.data);
        collisions(this.data);
        this.data.advance();
        fireAllEvents();
    }

    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
        this.data.reset();
        this.data.ballNow.x = ballX;
        this.data.ballNow.y = ballY;
        this.data.ballNow.vx = ballSpeedX;
        this.data.ballNow.vy = ballSpeedY;
    }
}


function propagateBarInputs(data: DataBuffer) {
    data.barsThen[0].copyKeysState(data.barsNow[0]);
    data.barsThen[1].copyKeysState(data.barsNow[1]);
}

// propagate graviton existance / death
function updateGravitons(data: DataBuffer) {
    data.gravitonsNow.forEach((graviton, id) => {
        if (graviton.age == GSettings.GRAVITON_LIFESPAN)
            data.gravitonsThen.delete(id);
        else {
            let gravitonThen: GravitonData;
            if (data.gravitonsThen.has(id))
                gravitonThen = data.gravitonsThen.get(id) as GravitonData;
            else {
                gravitonThen = GravitonData.clone(graviton);
                data.gravitonsThen.set(id, gravitonThen);
            }
            gravitonThen.age = graviton.age + 1;
        }
    })
}

function applyForces(data: DataBuffer) {
    let resultForce = Array.from(data.gravitonsNow.values())
        .map((graviton) => computeForce(data, graviton))
        .reduce((totalForce, currentForce) => totalForce.add(currentForce), new Vector2());
    console.log(resultForce);
    data.ballThen.vx = data.ballNow.vx + GSettings.GAME_STEP_S * resultForce.x;
    data.ballThen.vy = data.ballNow.vy + GSettings.GAME_STEP_S * resultForce.y;
}

function computeForce(data: DataBuffer, graviton: GravitonData): Vector2 {
    let dx = Math.abs(data.ballNow.x - graviton.x);
    if (dx > GSettings.GRAVITON_FORCE_WIDTH_HALF)
        return new Vector2();
    let mx = 1 - dx / GSettings.GRAVITON_FORCE_WIDTH_HALF;
    let dy = data.ballNow.y - graviton.y;
    let my;
    if (Math.abs(dy) < GSettings.GRAVITON_FORCE_HEIGHT_HALF)
        my = dy / GSettings.GRAVITON_FORCE_HEIGHT_HALF;
    else
        my = GSettings.GRAVITON_FORCE_HEIGHT_HALF / dy;
    return new Vector2(0, - mx * my * GSettings.GRAVITON_MAX_FORCE);
}

function applySpeed(data: DataBuffer) {
    data.ballThen.x = data.ballNow.x + GSettings.GAME_STEP_S * data.ballThen.vx;
    data.ballThen.y = data.ballNow.y + GSettings.GAME_STEP_S * data.ballThen.vy;
    data.barsThen[0].y = data.barsNow[0].y + GSettings.GAME_STEP_S * data.barsThen[0].vy;
    data.barsThen[1].y = data.barsNow[1].y + GSettings.GAME_STEP_S * data.barsThen[1].vy;
}
