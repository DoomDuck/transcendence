import { GSettings } from "../constants";
import {
  BarInputEvent,
  GameProducedEvent,
  SetBallEvent,
  type DataChangerEvent,
} from "../game/events";
import { collisions } from "./collisions";
import { GameDataBuffer } from "./data";
import {
  applyForces,
  applySpeed,
  processExternEvents,
  propagateBarInputs,
  updateSpawnable,
} from "./update";

export class GameState {
  data: GameDataBuffer = new GameDataBuffer();
  eventBuffer: DataChangerEvent[] = [];

  reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
    this.data.reset();
    this.data.current.ball.x = ballX;
    this.data.current.ball.y = ballY;
    this.data.current.ball.vx = ballSpeedX;
    this.data.current.ball.vy = ballSpeedY;
  }

  update() {
    this.computeOneStep();
    this.data.actualNow++;
    GameProducedEvent.fireAllEvents();
  }

  computeOneStep() {
    for (let event of this.eventBuffer) {
      this.handleEvent(event);
    }
    this.eventBuffer = [];
    processExternEvents(this.data);
    propagateBarInputs(this.data);
    updateSpawnable(this.data.current.gravitons, this.data.next.gravitons);
    updateSpawnable(this.data.current.portals, this.data.next.portals);
    applyForces(this.data);
    applySpeed(this.data);
    collisions(this.data);
    this.data.advance();
  }

  handleEvent(event: DataChangerEvent) {
    if (event.time < 0) return;
    if (this.data.actualNow - event.time >= 100) {
      // too old, discard
      return;
    }
    if (event.time >= this.data.currentTime) {
      this.data.addEvent(event.time, event);
      return;
    }
    if (event.time < this.data.currentTime) {
      console.log(
        `PAST, event.time = ${event.time}, data.currentTime = ${this.data.currentTime}, data.actualNow = ${this.data.actualNow}`
      );
      // past event
      let now = this.data.currentTime;
      this.data.goBackTo(event.time);
      this.data.addEventNow(event);
      while (this.data.currentTime != now) {
        this.computeOneStep();
      }
      return;
    }
  }

  registerEvent(event: DataChangerEvent) {
    this.eventBuffer.push(event);
  }
}
