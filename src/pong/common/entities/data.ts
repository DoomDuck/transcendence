import { GSettings } from "../constants";
import { type DataChangerEvent } from "../game/events";

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
        this.x = (barId == 0 ? -1: 1) * GSettings.BAR_INITIALX;
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
    constructor(public x: number = 0, public y: number = 0, public age: number = 0) {
        this.x = x;
        this.y = y;
        this.age = age;
    }

    static clone(other: GravitonData): GravitonData {
        return new GravitonData(other.x, other.y, other.age);
    }
}

export class DataBuffer {
    ballDataArray: BallData[] = Array.from({length: 100}, () => new BallData());
    barsDataArray: [BarData[], BarData[]] = [
        Array.from({length: 100}, () => new BarData(0)),
        Array.from({length: 100}, () => new BarData(1))];
    gravitonsDataArray: Set<GravitonData>[] = Array.from({length: 100}, () => new Set());
    eventsDataArray: DataChangerEvent[][] = Array.from({length: 100}, () => []);

    nowIndex: number = 0;
    thenIndex: number = 1;
    now: number = 0;

    ballNow: BallData;
    ballThen: BallData;
    barsNow: [BarData, BarData];
    barsThen: [BarData, BarData];
    gravitonsNow: Set<GravitonData>;
    gravitonsThen: Set<GravitonData>;
    eventsNow: DataChangerEvent[];
    eventsThen: DataChangerEvent[];

    constructor() {
        this.updateNowThenReferences();
    }

    updateNowThenReferences() {
        this.ballNow = this.ballDataArray[this.nowIndex];
        this.ballThen = this.ballDataArray[this.thenIndex];
        this.barsNow = [this.barsDataArray[0][this.nowIndex], this.barsDataArray[1][this.nowIndex]];
        this.barsThen = [this.barsDataArray[0][this.thenIndex], this.barsDataArray[1][this.thenIndex]];
        this.gravitonsNow = this.gravitonsDataArray[this.nowIndex];
        this.gravitonsThen = this.gravitonsDataArray[this.thenIndex];
        this.eventsNow = this.eventsDataArray[this.nowIndex];
        this.eventsThen = this.eventsDataArray[this.thenIndex];
    }

    advance() {
        this.now++;
        this.nowIndex = this.thenIndex;
        this.thenIndex = (this.thenIndex + 1) % 100;
        this.updateNowThenReferences();
    }
    reset() {
        this.now = 0;
        this.nowIndex = 0;
        this.thenIndex = 0;
        this.updateNowThenReferences();
        this.ballNow = new BallData();
        this.barsNow = [new BarData(0), new BarData(1)];
        this.gravitonsNow.clear();
    }

    addGraviton(timeIndex: number, id: number, x: number, y: number): void {
        let graviton = new GravitonData();
        graviton.x = x;
        graviton.y = y;
        this.gravitonsDataArray[timeIndex].add(graviton);
    }

    goBackTo(time: number) {
        let timeIndex = (time - this.now + this.nowIndex + 100) % 100;
        this.now = time;
        this.nowIndex = timeIndex;
        this.thenIndex = (timeIndex + 1) % 100;
        this.updateNowThenReferences();
    }
}
