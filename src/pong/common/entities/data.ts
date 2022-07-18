import { GSettings } from "../constants";
import { type DataChanger, type DataChangerEvent } from "../game/events";

export class BallData {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
}

export class BarData {
  x: number;
  y: number = 0;
  upPressed: boolean = false;
  downPressed: boolean = false;

  constructor(barId: number) {
    this.x = (barId == 0 ? -1 : 1) * GSettings.BAR_INITIALX;
  }

  get vy(): number {
    return (+this.downPressed - +this.upPressed) * GSettings.BAR_SENSITIVITY;
  }
  copyKeysState(bar: BarData) {
    this.downPressed = bar.downPressed;
    this.upPressed = bar.upPressed;
  }
}

export class GravitonData {
  constructor(
    public x: number,
    public y: number,
    public age: number
  ) {}
}

export class PortalHalfData {
  yTop: number;
  yBottom: number;

  constructor(
    public x: number,
    public y: number,
  ) {
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
export class PortalData {
  parts: [PortalHalfData, PortalHalfData];
  transportX: number;
  transportY: number;

  constructor(x1: number, y1: number, x2: number, y2: number, public age: number) {
    this.parts = [
      new PortalHalfData(x1, y1),
      new PortalHalfData(x2, y2),
    ];
    this.transportX = x2 - x1;
    this.transportY = y2 - y1;
  }
}

export class DataBuffer {
  ballArray: BallData[] = Array.from({ length: 100 }, () => new BallData());
  barsArray: [BarData[], BarData[]] = [
    Array.from({ length: 100 }, () => new BarData(0)),
    Array.from({ length: 100 }, () => new BarData(1)),
  ];
  gravitonsArray: Set<GravitonData>[] = Array.from(
    { length: 100 },
    () => new Set()
  );
  eventsArray: DataChanger[][] = [];
  portalsArray: Set<PortalData>[] = Array.from({ length: 100 }, () => new Set());

  currentIndex: number = 0;
  nextIndex: number = 1;
  currentTime: number = 0;
  actualNow: number = 0;

  ballCurrent: BallData;
  ballNext: BallData;
  barsCurrent: [BarData, BarData];
  barsNext: [BarData, BarData];
  gravitonsCurrent: Set<GravitonData>;
  gravitonsNext: Set<GravitonData>;
  portalsCurrent: Set<PortalData>;
  portalsNext: Set<PortalData>;

  constructor() {
    this.updateNowThenReferences();
  }

  get eventsNow(): DataChanger[] | null {
    return this.currentTime in this.eventsArray
      ? this.eventsArray[this.currentTime]
      : null;
  }

  addEventNow(event: DataChangerEvent) {
    this.addEvent(this.currentTime, event);
  }

  addEvent(time: number, event: DataChangerEvent) {
    const dataChanger = event.process.bind(event);
    if (!(time in this.eventsArray)) this.eventsArray[time] = [dataChanger];
    else this.eventsArray[time].push(dataChanger);
  }

  updateNowThenReferences() {
    this.ballCurrent = this.ballArray[this.currentIndex];
    this.ballNext = this.ballArray[this.nextIndex];
    this.barsCurrent = [
      this.barsArray[0][this.currentIndex],
      this.barsArray[1][this.currentIndex],
    ];
    this.barsNext = [
      this.barsArray[0][this.nextIndex],
      this.barsArray[1][this.nextIndex],
    ];
    this.gravitonsCurrent = this.gravitonsArray[this.currentIndex];
    this.gravitonsNext = this.gravitonsArray[this.nextIndex];
    this.portalsCurrent = this.portalsArray[this.currentIndex];
    this.portalsNext = this.portalsArray[this.nextIndex];
  }

  advance() {
    this.currentTime++;
    this.currentIndex = this.nextIndex;
    this.nextIndex = (this.nextIndex + 1) % 100;
    this.updateNowThenReferences();
  }

  reset() {
    this.currentTime = 0;
    this.actualNow = 0;
    this.currentIndex = 0;
    this.nextIndex = 0;
    this.updateNowThenReferences();
    this.ballCurrent = new BallData();
    this.barsCurrent = [new BarData(0), new BarData(1)];
    this.gravitonsCurrent.clear();
    this.portalsCurrent.clear();
    this.eventsArray = [];
  }

  addGraviton(x: number, y: number): void {
    let graviton = new GravitonData(x, y, 0);
    this.gravitonsArray[this.currentIndex].add(graviton);
  }

  addPortal(x1: number, y1: number, x2: number, y2: number): void {
    let portal = new PortalData(x1, y1, x2, y2, 0);
    this.portalsArray[this.currentIndex].add(portal);
  }

  goBackTo(time: number) {
    let timeIndex = (time - this.currentTime + this.currentIndex + 100) % 100;
    this.currentTime = time;
    this.currentIndex = timeIndex;
    this.nextIndex = (timeIndex + 1) % 100;
    this.updateNowThenReferences();
  }
}
