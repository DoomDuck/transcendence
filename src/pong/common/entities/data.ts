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
    ballArray: BallData[] = Array.from({length: 100}, () => new BallData());
    barsArray: [BarData[], BarData[]] = [
        Array.from({length: 100}, () => new BarData(0)),
        Array.from({length: 100}, () => new BarData(1))];
    gravitonsArray: Set<GravitonData>[] = Array.from({length: 100}, () => new Set());
    eventsArray: DataChanger[][] = [];

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
    // eventsNow: DataChangerEvent[];
    // eventsThen: DataChangerEvent[];

    constructor() {
        this.updateNowThenReferences();
    }

    get eventsNow(): DataChanger[] | null {
        return this.currentTime in this.eventsArray ? this.eventsArray[this.currentTime] : null;
    }

    addEventNow(event: DataChangerEvent) {
        const dataChanger = event.process.bind(event);
        if (!(this.currentTime in this.eventsArray))
            this.eventsArray[this.currentTime] = [dataChanger];
        else
            this.eventsArray[this.currentTime].push(dataChanger);
    }

    updateNowThenReferences() {
        this.ballCurrent = this.ballArray[this.currentIndex];
        this.ballNext = this.ballArray[this.nextIndex];
        this.barsCurrent = [this.barsArray[0][this.currentIndex], this.barsArray[1][this.currentIndex]];
        this.barsNext = [this.barsArray[0][this.nextIndex], this.barsArray[1][this.nextIndex]];
        this.gravitonsCurrent = this.gravitonsArray[this.currentIndex];
        this.gravitonsNext = this.gravitonsArray[this.nextIndex];
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
        this.eventsArray = [];
    }


    addGraviton(timeIndex: number, id: number, x: number, y: number): void {
        let graviton = new GravitonData();
        graviton.x = x;
        graviton.y = y;
        this.gravitonsArray[timeIndex].add(graviton);
    }

    goBackTo(time: number) {
        let timeIndex = (time - this.currentTime + this.currentIndex + 100) % 100;
        this.currentTime = time;
        this.currentIndex = timeIndex;
        this.nextIndex = (timeIndex + 1) % 100;
        this.updateNowThenReferences();
    }
}
