import {
  BarInputEvent,
  GameProducedEvent,
  SetBallEvent,
  type DataChangerEvent,
} from "../game/events";
import { collisions } from "./collisions";
import { DataBuffer } from "./data";
import {
  applyForces,
  applySpeed,
  processExternEvents,
  propagateBarInputs,
  updateGravitons,
} from "./update";

export class GameState {
  data: DataBuffer = new DataBuffer();
  eventBuffer: DataChangerEvent[] = [];

  reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
    this.data.reset();
    this.data.ballCurrent.x = ballX;
    this.data.ballCurrent.y = ballY;
    this.data.ballCurrent.vx = ballSpeedX;
    this.data.ballCurrent.vy = ballSpeedY;
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
    updateGravitons(this.data);
    applyForces(this.data);
    applySpeed(this.data);
    collisions(this.data);
    this.data.advance();
  }

  handleEvent(event: DataChangerEvent) {
    if (event.time < 0) return;
    if (Math.abs(event.time - this.data.actualNow) >= 100) {
      // too old or too far, discard
      return;
    }
    if (event.time == this.data.currentTime) {
      this.data.addEventNow(event);
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
