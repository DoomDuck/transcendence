import { type ExternEvent } from "../game/events";
import { GSettings } from "../constants";
import { Vector2 } from "../utils";
import { ballBar1Collision, ballBar2Collision, ballWallBottomCollision, ballWallTopCollision, clipBarPosition } from "./collisions";
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
        applyForces(this.data);
        applySpeed(this.data);
        collisions(this.data);
        for (let event of this.data.producedEvents) {
            
        }
        this.data.advance();
    }

    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
        this.data.reset();
        this.data.ballNow.x = ballX;
        this.data.ballNow.y = ballY;
        this.data.ballNow.vx = ballSpeedX;
        this.data.ballNow.vy = ballSpeedY;
    }
}

function applyForces(data: DataBuffer) {
    let resultForce = data.gravitonsNow.map(
        (graviton, id) => {
            // side effect to propagate graviton existance / death
            if (graviton.age == GSettings.GRAVITON_LIFESPAN)
                delete data.gravitonsThen[id];
            else if (!(id in data.gravitonsThen))
                data.gravitonsThen[id] = graviton.clone();
            data.gravitonsThen[id].age++;

            return computeForce(data, graviton);
        }).reduce((totalForce, currentForce) => totalForce.add(currentForce), new Vector2());

    data.ballThen.vx = data.ballNow.vx + GSettings.GAME_STEP_S * resultForce.x;
    data.ballThen.vy = data.ballNow.vy + GSettings.GAME_STEP_S * resultForce.y;
    data.barsThen[0].copyKeysState(data.barsNow[0]);
    data.barsThen[1].copyKeysState(data.barsNow[1]);
}

function computeForce(data: DataBuffer, graviton: GravitonData): Vector2 {
    let dx = Math.abs(data.ballNow.x - graviton.x);
    if (dx > GSettings.GRAVITON_LENGTH_HALF)
        return new Vector2();
    let mx = 1 - dx / GSettings.GRAVITON_LENGTH_HALF;
    let dy = data.ballNow.y - graviton.y;
    let my;
    if (Math.abs(dy) < GSettings.GRAVITON_HEIGHT_HALF)
        my = dy / GSettings.GRAVITON_HEIGHT_HALF;
    else
        my = Math.sign(dy) / (dy / GSettings.GRAVITON_HEIGHT_HALF) ** 2;
    return new Vector2(0, mx * my * GSettings.GRAVITON_MAX_FORCE);
}

function applySpeed(data: DataBuffer) {
    data.ballThen.x = data.ballNow.x + GSettings.GAME_STEP_S * data.ballThen.vx;
    data.ballThen.y = data.ballNow.y + GSettings.GAME_STEP_S * data.ballThen.vy;
    data.barsThen[0].y = data.barsNow[0].y + GSettings.GAME_STEP_S * data.barsThen[0].vy;
    data.barsThen[1].y = data.barsNow[1].y + GSettings.GAME_STEP_S * data.barsThen[1].vy;
}

function collisions(data: DataBuffer) {
    ballWallTopCollision(data);
    ballWallBottomCollision(data);
    clipBarPosition(data, 0);
    clipBarPosition(data, 1);
    ballBar1Collision(data);
    ballBar2Collision(data);
}
