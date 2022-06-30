import { GSettings } from "../constants";
import { produceEvent } from "../game/events";
// import { BallOutEvent } from "../game/events";
import { DataBuffer } from "./data";

function ballWallTopCollision(data: DataBuffer) {
    let ballTop = data.ballThen.y - GSettings.BALL_RADIUS;
    if (ballTop < GSettings.GAME_TOP) {
        let dtCollision = Math.abs((GSettings.GAME_TOP - ballTop) / data.ballThen.vy);
        applyWallCollision(data, dtCollision);
    }
}

function ballWallBottomCollision(data: DataBuffer) {
    let ballBottom = data.ballThen.y + GSettings.BALL_RADIUS;
    if (ballBottom > GSettings.GAME_BOTTOM) {
        let dtCollision = Math.abs((GSettings.GAME_BOTTOM - ballBottom) / data.ballThen.vy);
        applyWallCollision(data, dtCollision);
    }
}

function applyWallCollision(data: DataBuffer, dtCollision: number) {
    data.ballThen.y = data.ballNow.y + (2 * dtCollision - GSettings.GAME_STEP_S) * data.ballThen.vy;
    data.ballThen.vy = -data.ballNow.vy;
    console.log(data.ballNow.vy, data.ballThen.vy);
}

function ballBar1Collision(data: DataBuffer) {
    if (data.ballNow.x - GSettings.BALL_RADIUS < -GSettings.BAR_COLLISION_EDGE)
        return;
    let ballEdge = data.ballThen.x - GSettings.BALL_RADIUS;
    if (ballEdge < -GSettings.BAR_COLLISION_EDGE) {
        let dtCollision = Math.abs((-GSettings.BAR_COLLISION_EDGE - ballEdge) / data.ballThen.vx);
        applyBarCollision(data, dtCollision, 0);
    }
}

function ballBar2Collision(data: DataBuffer) {
    if (data.ballNow.x + GSettings.BALL_RADIUS > GSettings.BAR_COLLISION_EDGE)
        return;
    let ballEdge = data.ballThen.x + GSettings.BALL_RADIUS;
    if (ballEdge > GSettings.BAR_COLLISION_EDGE) {
        let dtCollision = Math.abs((GSettings.BAR_COLLISION_EDGE - ballEdge) / data.ballThen.vx);
        applyBarCollision(data, dtCollision, 1);
    }
}

function applyBarCollision(data: DataBuffer, dtCollision: number, barId: number) {
    let barNow = data.barsNow[barId];
    let yBarCollision = barNow.y + dtCollision * barNow.vy;
    let yBallCollision = data.ballNow.y + dtCollision * data.ballNow.vy;
    let dYCollision = yBallCollision - yBarCollision;
    if (Math.abs(dYCollision) < GSettings.BALL_RADIUS + GSettings.BAR_HEIGHT / 2) {
        //emitcollision
        data.ballThen.vx = -data.ballNow.vx;
        let newVy = dYCollision * GSettings.COLLISION_VY_RATIO;
        data.ballThen.x = data.ballNow.x + (2 * dtCollision - GSettings.GAME_STEP_S) * data.ballThen.vx;
        data.ballThen.y = data.ballNow.y + dtCollision * data.ballThen.vy + (GSettings.GAME_STEP_S - dtCollision) * newVy;
        data.ballThen.vy = newVy;
    }
    else {
        //emitnocollision
    }
}

function clipBarPosition(data: DataBuffer, barId: number) {
    let bar = data.barsThen[barId];
    if (bar.y - GSettings.BAR_HEIGHT_HALF < GSettings.GAME_TOP)
        bar.y = GSettings.GAME_TOP + GSettings.BAR_HEIGHT_HALF;
    else if (bar.y + GSettings.BAR_HEIGHT_HALF > GSettings.GAME_BOTTOM)
    bar.y = GSettings.GAME_BOTTOM - GSettings.BAR_HEIGHT_HALF;
}

function ballWallGameEdgeCollision(data: DataBuffer) {
    const ballEdge = Math.abs(data.ballThen.x) + GSettings.BALL_RADIUS;
    if (ballEdge > GSettings.GAME_RIGHT)
        produceEvent("ballOut", data.now, data.ballThen.x > 0 ? 1 : 0);
}

export function collisions(data: DataBuffer) {
    ballWallTopCollision(data);
    ballWallBottomCollision(data);
    ballWallGameEdgeCollision(data);
    clipBarPosition(data, 0);
    clipBarPosition(data, 1);
    ballBar1Collision(data);
    ballBar2Collision(data);
}
