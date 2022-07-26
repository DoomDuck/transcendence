import { BallData } from ".";
import { GSettings } from "../../constants";
import { type Spawnable } from ".";

export class PortalHalfData {
  yTop: number;
  yBottom: number;

  constructor(public x: number, public y: number) {
    this.yTop = y - GSettings.PORTAL_HEIGHT / 2;
    this.yBottom = y + GSettings.PORTAL_HEIGHT / 2;
  }

  ballIsLeft(ball: BallData) {
    return ball.x <= this.x && ball.y >= this.yTop && ball.y <= this.yBottom;
  }
  ballIsRight(ball: BallData) {
    return ball.x > this.x && ball.y >= this.yTop && ball.y <= this.yBottom;
  }
}
export class PortalData implements Spawnable {
  parts: [PortalHalfData, PortalHalfData];
  transportX: number;
  transportY: number;

  constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    public age: number,
    public lifespan: number
  ) {
    this.parts = [new PortalHalfData(x1, y1), new PortalHalfData(x2, y2)];
    this.transportX = x2 - x1;
    this.transportY = y2 - y1;
  }
}
