import { GSettings, KeyValue } from "../constants";
import { BallData, DataBuffer } from "../entities/data";
import { Game } from "./Game";

/**
 * Such events operate on the Game's data.
 * Theire registration is handled in GameState which may result in
 * discarding (too far in the past) or re-computation (recent past).
 * From their point of view, they process the data as if they happen in the present.
 */
export type DataChanger = (data: DataBuffer) => void;
export interface DataChangerEvent {
  // type: string;
  time: number;
  process(data: DataBuffer): void;
}

// export interface DataChangerEvent {
//     time: number;
//     process(data: DataBuffer): void;
// }
export type BarInputEventStruct = [number, number, KeyValue, boolean];
export class BarInputEvent implements DataChangerEvent {
  constructor(
    public time: number,
    public barId: number,
    public key: KeyValue,
    public pressed: boolean
  ) {}

  // for now ignore time ...
  process(data: DataBuffer) {
    if (this.key == KeyValue.UP)
      data.barsCurrent[this.barId].upPressed = this.pressed;
    else data.barsCurrent[this.barId].downPressed = this.pressed;
  }
}

function ballErrors(
  ball: BallData,
  x: number,
  y: number,
  vx: number,
  vy: number
) {
  return [
    Math.sqrt((ball.x - x) ** 2 + (ball.y - y) ** 2),
    Math.sqrt((ball.vx - vx) ** 2 + (ball.vy - vy) ** 2),
  ];
}
export class SetBallEvent implements DataChangerEvent {
  constructor(
    public time: number,
    public x: number,
    public y: number,
    public vx: number,
    public vy: number
  ) {}

  process(data: DataBuffer) {
    let [posError, speedError] = ballErrors(
      data.ballCurrent,
      this.x,
      this.y,
      this.vx,
      this.vy
    );
    console.log(
      `set ball event: posError = ${posError}, speedError = ${speedError}`
    );
    if (
      posError > GSettings.BALL_POS_ERROR_MAX ||
      speedError > GSettings.BALL_SPEED_ERROR_MAX
    ) {
      data.ballCurrent.x = this.x;
      data.ballCurrent.y = this.y;
      data.ballCurrent.vx = this.vx;
      data.ballCurrent.vy = this.vy;
      console.log("correcting ball");
      // return ["ball"];
    }
    // return undefined;
  }
}

export type SpawnGravitonEventStruct = [number, number, number];
export class SpawnGravitonEvent implements DataChangerEvent {
  constructor(public time: number, public x: number, public y: number) {}

  process(data: DataBuffer) {
    data.addGraviton(this.x, this.y);
  }
}

export type SpawnPortalEventStruct = [number, number, number];
export class SpawnPortalEvent implements DataChangerEvent {
  constructor(
    public time: number,
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number
  ) {}

  process(data: DataBuffer) {
    data.addPortal(this.x1, this.y1, this.x2, this.y2);
  }
}

/**
 * The following define events produced during the update of GameState
 * that can be handled outside (ClientGameManager, ServerGameManager)
 */
export namespace GameProducedEvent {
  export const allEventsCallbacks: Map<string, Function[]> = new Map();
  export function registerEvent(name: string, callback: Function) {
    if (!allEventsCallbacks.has(name)) allEventsCallbacks.set(name, [callback]);
    else allEventsCallbacks.get(name)?.push(callback);
  }

  const allEvents: Map<string, any[][]> = new Map();
  export function produceEvent(name: string, ...args: any[]) {
    if (!allEvents.has(name)) allEvents.set(name, [args]);
    else allEvents.get(name)?.push(args);
  }

  export function fireAllEvents() {
    for (let name of allEventsCallbacks.keys()) {
      allEvents.get(name)?.forEach((args: any[]) => {
        allEventsCallbacks
          .get(name)
          ?.forEach((callback: Function) => callback(...args));
      });
      allEvents.set(name, []);
    }
  }
}
