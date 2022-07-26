/**
 * Collision-related computations, involving the ball:
 *  - with walls (rigid bodies)
 *  - with the game's edges (trigger "ball out" event)
 *  - with the bars
 *  - with portals
 * Also position clipping for the bar
 */

import { GameEvent, GSettings } from "../constants";
import { GameProducedEvent } from "../game/events";
import { BallData, GameDataBuffer, PortalData } from "./data";

function ballWallTopCollision(data: GameDataBuffer) {
  let ballTop = data.next.ball.y - GSettings.BALL_RADIUS;
  if (ballTop < GSettings.GAME_TOP) {
    let dtCollision = Math.abs(
      (GSettings.GAME_TOP - ballTop) / data.next.ball.vy
    );
    applyWallCollision(data, dtCollision);
  }
}

function ballWallBottomCollision(data: GameDataBuffer) {
  let ballBottom = data.next.ball.y + GSettings.BALL_RADIUS;
  if (ballBottom > GSettings.GAME_BOTTOM) {
    let dtCollision = Math.abs(
      (GSettings.GAME_BOTTOM - ballBottom) / data.next.ball.vy
    );
    applyWallCollision(data, dtCollision);
  }
}

function applyWallCollision(data: GameDataBuffer, dtCollision: number) {
  data.next.ball.y =
    data.current.ball.y +
    (2 * dtCollision - GSettings.GAME_STEP_S) * data.next.ball.vy;
  data.next.ball.vy = -data.current.ball.vy;
}

function ballBar1Collision(data: GameDataBuffer) {
  if (
    data.current.ball.x - GSettings.BALL_RADIUS <
    -GSettings.BAR_COLLISION_EDGE
  )
    return;
  let ballEdge = data.next.ball.x - GSettings.BALL_RADIUS;
  if (ballEdge < -GSettings.BAR_COLLISION_EDGE) {
    let dtCollision = Math.abs(
      (-GSettings.BAR_COLLISION_EDGE - ballEdge) / data.next.ball.vx
    );
    applyBallBarCollision(data, dtCollision, 0);
  }
}

function ballBar2Collision(data: GameDataBuffer) {
  if (
    data.current.ball.x + GSettings.BALL_RADIUS >
    GSettings.BAR_COLLISION_EDGE
  )
    return;
  let ballEdge = data.next.ball.x + GSettings.BALL_RADIUS;
  if (ballEdge > GSettings.BAR_COLLISION_EDGE) {
    let dtCollision = Math.abs(
      (GSettings.BAR_COLLISION_EDGE - ballEdge) / data.next.ball.vx
    );
    applyBallBarCollision(data, dtCollision, 1);
  }
}

function applyBallBarCollision(
  data: GameDataBuffer,
  dtCollision: number,
  barId: number
) {
  let barNow = data.current.bars[barId];
  let yBarCollision = barNow.y + dtCollision * barNow.vy;
  let yBallCollision = data.current.ball.y + dtCollision * data.current.ball.vy;
  let dYCollision = yBallCollision - yBarCollision;
  if (
    Math.abs(dYCollision) <
    GSettings.BALL_RADIUS + GSettings.BAR_HEIGHT / 2
  ) {
    data.next.ball.vx = -(
      data.current.ball.vx +
      Math.sign(data.current.ball.vx) * GSettings.BALL_SPEEDX_INCREASE
    );
    clipBallSpeedX(data.next.ball);
    let newVy = dYCollision * GSettings.BALL_COLLISION_VY_RATIO;
    data.next.ball.x =
      data.current.ball.x +
      (2 * dtCollision - GSettings.GAME_STEP_S) * data.next.ball.vx;
    data.next.ball.y =
      data.current.ball.y +
      dtCollision * data.next.ball.vy +
      (GSettings.GAME_STEP_S - dtCollision) * newVy;
    data.next.ball.vy = newVy;
    GameProducedEvent.produceEvent(
      GameEvent.BALL_BAR_COLLISION,
      barId,
      data.currentTime + 1,
      data.next.ball.x,
      data.next.ball.y,
      data.next.ball.vx,
      data.next.ball.vy
    );
  } else {
    GameProducedEvent.produceEvent(
      GameEvent.NO_BALL_BAR_COLLISION,
      barId,
      data.currentTime + 1
    );
  }
}

export function clipBallSpeedX(ball: BallData) {
  let sign = Math.sign(ball.vx);
  if (sign * ball.vx > GSettings.BALL_SPEEDX_MAX)
    ball.vx = sign * GSettings.BALL_SPEEDX_MAX;
}

export function clipBallSpeedY(ball: BallData) {
  let sign = Math.sign(ball.vy);
  if (sign * ball.vy > GSettings.BALL_SPEEDY_MAX)
    ball.vy = sign * GSettings.BALL_SPEEDY_MAX;
}

function clipBarPosition(data: GameDataBuffer, barId: number) {
  let bar = data.next.bars[barId];
  if (bar.y - GSettings.BAR_HEIGHT_HALF < GSettings.GAME_TOP)
    bar.y = GSettings.GAME_TOP + GSettings.BAR_HEIGHT_HALF;
  else if (bar.y + GSettings.BAR_HEIGHT_HALF > GSettings.GAME_BOTTOM)
    bar.y = GSettings.GAME_BOTTOM - GSettings.BAR_HEIGHT_HALF;
}

function ballGameEdgeCollision(data: GameDataBuffer) {
  const ballEdge = Math.abs(data.next.ball.x) + GSettings.BALL_RADIUS;
  if (ballEdge > GSettings.GAME_RIGHT) {
    GameProducedEvent.produceEvent(
      "ballOut",
      data.currentTime,
      data.next.ball.x > 0 ? 1 : 0
    );
  }
}

function ballPortalCollision(data: GameDataBuffer) {
  for (let portal of data.current.portals.values()) {
    ballPortalCollisionOne(data, portal);
  }
}

function ballPortalCollisionOne(data: GameDataBuffer, portal: PortalData) {
  if (
    data.current.ball.vx > 0 &&
    portal.parts[0].ballIsLeft(data.current.ball) &&
    portal.parts[0].ballIsRight(data.next.ball)
  ) {
    data.next.ball.x += portal.transportX;
    data.next.ball.y += portal.transportY;
  } else if (
    data.current.ball.vx < 0 &&
    portal.parts[1].ballIsRight(data.current.ball) &&
    portal.parts[1].ballIsLeft(data.next.ball)
  ) {
    data.next.ball.x -= portal.transportX;
    data.next.ball.y -= portal.transportY;
  }
}

export function collisions(data: GameDataBuffer) {
  ballWallTopCollision(data);
  ballWallBottomCollision(data);
  ballGameEdgeCollision(data);
  clipBarPosition(data, 0);
  clipBarPosition(data, 1);
  ballBar1Collision(data);
  ballBar2Collision(data);
  ballPortalCollision(data);
}
