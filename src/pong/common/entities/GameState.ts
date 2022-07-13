import { GameProducedEvent, type DataChangerEvent } from "../game/events";
import { DataBuffer } from "./data";
import { updateOneStep, updateOneStepNoErasure } from "./update";

export class GameState {
    data: DataBuffer = new DataBuffer();

    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
        this.data.reset();
        this.data.ballNow.x = ballX;
        this.data.ballNow.y = ballY;
        this.data.ballNow.vx = ballSpeedX;
        this.data.ballNow.vy = ballSpeedY;
    }

    update() {
        updateOneStep(this.data);
        GameProducedEvent.fireAllEvents();
    }

    // updateUntil(time: GameTime) {
    //     if (time < this.data.now)
    //         throw new Error("cannot call GameState.updateUntil with a past instant as parameter")
    //     while (this.data.now < time)
    //         updateOneStep(this.data);
    // }

    // canRewind(time: GameTime): boolean {
    //     return time <= this.data.now && (this.data.now - time) < 100;
    // }

    // rewindTo(time: GameTime) {

    // }

    reUpdate() {
        updateOneStepNoErasure(this.data);
    }

    // TODO: Future events
    registerEvent(event: DataChangerEvent): boolean {
        if (Math.abs(event.time - this.data.now) >= 100) {
            // too old or too far, discard
            return false;
        }
        else if (event.time == this.data.now) {
            this.data.eventsNow.push(event);
            return true;
        }
        else if (event.time < this.data.now) {
            // past event
            let now = this.data.now;
            this.data.goBackTo(event.time);
            this.data.eventsNow.push(event);
            while (this.data.now != now) {
                this.reUpdate();
            }
            return true;
        }
        else {
            // future event
            return true;
        }
    }
}