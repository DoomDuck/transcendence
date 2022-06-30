import { GSettings } from "../constants";

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
    gravitonsDataArray: Map<number, GravitonData>[] = Array.from({length: 100}, () => new Map());
    nowIndex: number = 0;
    now: number = 0;

    ballNow: BallData;
    ballThen: BallData;
    barsNow: [BarData, BarData];
    barsThen: [BarData, BarData];
    gravitonsNow: Map<number, GravitonData>;
    gravitonsThen: Map<number, GravitonData>;

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
    }

    get thenIndex(): number {
        return (this.nowIndex + 1) % 100;
    }

    advance() {
        this.now++;
        this.nowIndex = (this.nowIndex + 1) % 100;
        this.updateNowThenReferences();
    }
    reset() {
        this.ballNow = new BallData();
        this.barsNow = [new BarData(0), new BarData(1)];
        this.gravitonsNow.clear();
    }

    ballData(timeIndex: number): BallData {
        return this.ballDataArray[timeIndex];
    }
    barData(timeIndex: number, id: number): BarData {
        return this.barsDataArray[id][timeIndex];
    }
    getGravitonData(timeIndex: number, id: number): GravitonData {
        return this.gravitonsDataArray[timeIndex].get(id) as GravitonData;
    }
    addGraviton(timeIndex: number, id: number, x: number, y: number): void {
        let graviton = new GravitonData();
        graviton.x = x;
        graviton.y = y;
        this.gravitonsDataArray[timeIndex].set(id, graviton);
    }
}
