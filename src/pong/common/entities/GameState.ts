import { fireAllEvents, type ExternEvent } from "../game/events";
import { DataBuffer } from "./data";
import { updateOneStep } from "./update";

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

    // TODO: Future events
    registerEvent(event: ExternEvent): boolean {
        if (event.time - this.data.now >= 100) {
            // too old, discard
            return false;
        }
        else if (event.time == this.data.now) {
            this.data.eventsNow.push(event);
            return true;
        }
        else {
            let timeIndex = (event.time - this.data.now + this.data.nowIndex + 100) % 100;
            this.data.eventsDataArray[timeIndex].push(event);
            this.computeSince(timeIndex);
            return true;
        }
    }

    computeSince(timeIndex: number) {
        const targetIndex = this.data.nowIndex;
        this.data.nowIndex = timeIndex;
        this.data.thenIndex = (timeIndex + 1) % 100;
        while (this.data.nowIndex != targetIndex) {
            this.update();
        }
    }
}