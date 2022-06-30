import { fireAllEvents, type ExternEvent } from "../game/events";
import { GSettings } from "../constants";
import { Vector2 } from "../utils";
import { collisions } from "./collisions";
import { DataBuffer, GravitonData } from "./data";
import { clipBallSpeedY } from "./collisions";
import { applyForces, applySpeed, propagateBarInputs, updateGravitons } from "./update";

export class GameState {
    data: DataBuffer = new DataBuffer();
    events: ExternEvent[] = [];

    registerEvent(event: ExternEvent) {
        this.events.push(event);
    }

    update() {
        for (let event of this.events) {
            event.process(this.data);
        }
        this.events = [];
        propagateBarInputs(this.data);
        updateGravitons(this.data);
        applyForces(this.data);
        applySpeed(this.data);
        collisions(this.data);
        this.data.advance();
        fireAllEvents();
    }

    reset(ballX: number, ballY: number, ballSpeedX: number, ballSpeedY: number) {
        this.data.reset();
        this.data.ballNow.x = ballX;
        this.data.ballNow.y = ballY;
        this.data.ballNow.vx = ballSpeedX;
        this.data.ballNow.vy = ballSpeedY;
    }
}