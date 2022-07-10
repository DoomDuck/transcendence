import { Vector2 } from "../../common/utils";

export class SingleNumberPanel {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    width: number;

    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = 200;
        this.canvas.height = 100;
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.context.fillStyle = "white";
        this.context.font = "64px Avenir Medium";
        this.context.textBaseline = "top";
        this.setValue(10000);
    }

    setValue(value: number) {
        this.context.clearRect(0, 0, 200, 100);
        this.context.fillText(value.toString(), 0, 0);
        this.width = this.context.measureText(value.toString()).width;
    }

    draw(mainContext: CanvasRenderingContext2D, x: number, y: number, size: number) {
        mainContext.drawImage(this.canvas, 0, 0, 200, 100, x, y - size / 2, 2 * size, size);
    }
}
