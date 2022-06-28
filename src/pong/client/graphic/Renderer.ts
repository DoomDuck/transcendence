import { GSettings } from "../../common/constants";
import { BallData, BarData, DataBuffer, GravitonData } from "../../common/entities/data";

export class Renderer {
    context: CanvasRenderingContext2D;
    imageData: ImageData;
    ratio: number;
    background: ImageData;
    ballRadius: number;
    barWidth: number;
    barHeight: number;

    constructor(public canvas: HTMLCanvasElement, public data: DataBuffer) {
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    handleResize(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.ratio = width / GSettings.SCREEN_WIDTH;
        this.ballRadius = this.ratio * GSettings.BALL_RADIUS;
        this.barWidth = this.ratio * GSettings.BAR_WIDTH;
        this.barHeight = this.ratio * GSettings.BAR_HEIGHT;
        this.imageData = this.context.getImageData(0, 0, width, height);
        this.createBackground();
    }

    createBackground() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const blockSize = this.canvas.height / 20;

        this.context.fillStyle = `rgb(0, 0, 0)`;
        this.context.fillRect(0, 0, width, height);

        this.context.fillStyle = `rgb(173, 173, 173)`;
        this.context.fillRect(0, 0, width, blockSize);
        this.context.fillRect(0, height - blockSize, width, blockSize);

        for (let step = 1; step < 20; step += 2) {
            this.context.fillRect(width / 2 - blockSize / 2, step * blockSize, blockSize, blockSize);
        }
        this.background = this.context.createImageData(width, height);
        this.background.data.set(this.context.getImageData(0, 0, width, height).data);
    }

    drawBackground() {
        this.imageData.data.set(this.background.data);
    }

    gameToCanvasCoord(x: number, y: number) {
        return [this.ratio * (x - GSettings.SCREEN_LEFT), this.ratio * (y - GSettings.SCREEN_TOP)];
    }

    drawBall(ball: BallData) {
        this.context.fillStyle = GSettings.BALL_COLOR;
        const [x, y] = this.gameToCanvasCoord(ball.x, ball.y);
        // this.context.ellipse(x, y, this.ballRadius, this.ballRadius, 0, 0, 2 * Math.PI);
        this.context.beginPath();
        this.context.ellipse(x, y, this.ballRadius, this.ballRadius, 0, 0, 2 * Math.PI);
        this.context.fill();
    }
    drawBar(bar: BarData) {
        this.context.fillStyle = GSettings.BAR_COLOR;
        const [x1, y1] = this.gameToCanvasCoord(bar.x - GSettings.BAR_WIDTH / 2, bar.y - GSettings.BAR_HEIGHT / 2);
        this.context.beginPath();
        this.context.fillRect(x1, y1, this.barWidth, this.barHeight);
        this.context.stroke();
    }
    drawGraviton(graviton: GravitonData) {

    }
    render() {
        this.context.fillStyle = 'black';
        this.context.beginPath();
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // this.drawBackground();
        this.context.stroke();
        this.drawBall(this.data.ballNow);
        this.drawBar(this.data.barsNow[0]);
        this.drawBar(this.data.barsNow[1]);
    }
}

