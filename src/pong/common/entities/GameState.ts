import { fireAllEvents, type ExternEvent } from "../game/events";
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
        fireAllEvents();
    }

    reUpdate() {
        updateOneStepNoErasure(this.data);
    }

    // TODO: Future events
    registerEvent(event: ExternEvent): boolean {
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