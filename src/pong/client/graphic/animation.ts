import { GSettings } from "../../common/constants";
import { DataBuffer } from "../../common/entities/data";
import { Renderer } from "./Renderer";

export class VictoryAnimation {
    firstTime: number;
    lastTime: number;
    frameCalled: boolean = false;
    previousRadius: number;
    ended: boolean = false;
    constructor(public renderer: Renderer, public thenCallback: () => any) {
        this.previousRadius = renderer.ballRadius;
    }
    frame(time: number) {
        if (time - this.firstTime > GSettings.VICTORY_ANIMATION_DURATION_MS) {
            if (!this.ended)
                this.thenCallback();
            this.ended = true;
            return;
        }
        let elapsed;
        if (!this.frameCalled) {
            this.firstTime = time;
            this.frameCalled = true;
            elapsed = 0;
        }
        else
            elapsed = time - this.lastTime;
        this.lastTime = time;
        let nextRadius = elapsed * GSettings.VICTORY_ANIMATION_SPEED + this.previousRadius;
        this.renderer.context.beginPath();
        this.renderer.context.fillStyle = GSettings.VICTORY_ANIMATION_COLOR;
        let [x, y] = this.renderer.gameToCanvasCoord(this.renderer.data.ballNow.x, this.renderer.data.ballNow.y)
        this.renderer.context.ellipse(x, y, this.previousRadius, this.previousRadius, 0, 0, 2 * Math.PI);
        this.renderer.context.ellipse(x, y, nextRadius, nextRadius, 0, 0, 2 * Math.PI);
        this.renderer.context.fill();
        this.previousRadius = nextRadius;
    }
}