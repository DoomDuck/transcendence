import { GSettings } from "../../common/constants";
import { BallData, BarData, DataBuffer, GravitonData } from "../../common/entities/data";
import { AnimatedSprite } from "./AnimatedSprite";
import { VictoryAnimation } from "./animation";

export class Renderer {
    context: CanvasRenderingContext2D;
    ratio: number;
    background: ImageData;
    ballRadius: number;
    barWidth: number;
    barHeight: number;
    gravitonSize: number;
    gravitonAnimationOpening: AnimatedSprite;
    gravitonAnimationPulling: AnimatedSprite;
    victoryAnimation?: VictoryAnimation;

    constructor(public canvas: HTMLCanvasElement, public data: DataBuffer) {
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.gravitonAnimationOpening = new AnimatedSprite("/public/img/graviton_opening.png", 128, 128, 10);
        this.gravitonAnimationPulling = new AnimatedSprite("/public/img/graviton_pulling.png", 128, 128, 9);
    }

    handleResize(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.ratio = width / GSettings.SCREEN_WIDTH;
        this.ballRadius = this.ratio * GSettings.BALL_RADIUS;
        this.barWidth = this.ratio * GSettings.BAR_WIDTH;
        this.barHeight = this.ratio * GSettings.BAR_HEIGHT;
        this.gravitonSize = this.ratio * GSettings.GRAVITON_SIZE;
        this.createBackground();
    }

    createBackground() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const blockSize = this.canvas.height / 20;

        this.context.fillStyle = `rgb(0, 0, 0, 255)`;
        this.context.beginPath();
        this.context.fillRect(0, 0, width, height);
        this.context.stroke();

        this.context.fillStyle = `rgb(173, 173, 173)`;
        this.context.beginPath();
        this.context.fillRect(0, 0, width, blockSize);
        this.context.stroke();
        this.context.beginPath();
        this.context.fillRect(0, height - blockSize, width, blockSize);
        this.context.stroke();

        for (let step = 1; step < 20; step += 2) {
            this.context.beginPath();
            this.context.fillRect(width / 2 - blockSize / 2, step * blockSize, blockSize, blockSize);
            this.context.stroke();
        }
        this.background = this.context.getImageData(0, 0, width, height);
    }

    drawBackground() {
        // this.imageData.data.set(this.background.data);
        // this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data.set(this.background.data);
        this.context.putImageData(this.background, 0, 0);
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
        const [x, y] = this.gameToCanvasCoord(graviton.x - GSettings.GRAVITON_SIZE / 2, graviton.y - GSettings.GRAVITON_SIZE / 2);
        let iFrame = Math.floor(graviton.age / 5);
        if (iFrame < this.gravitonAnimationOpening.nFrames) {
            this.drawGravitonOpening(x, y, iFrame);
            return;
        }
        iFrame -= this.gravitonAnimationOpening.nFrames;
        if (GSettings.GRAVITON_LIFESPAN - graviton.age >= 5 * this.gravitonAnimationOpening.nFrames) {
            this.drawGravitonPulling(x, y, iFrame);
            return;
        }
        iFrame = Math.floor((GSettings.GRAVITON_LIFESPAN - graviton.age) / 5);
        this.drawGravitonOpening(x, y, iFrame);
    }
    drawGravitonOpening(x: number, y: number, iFrame: number) {
        this.gravitonAnimationOpening.draw(this.context, x, y, this.gravitonSize, this.gravitonSize, iFrame);
    }
    drawGravitonPulling(x: number, y: number, iFrame: number) {
        this.gravitonAnimationPulling.draw(this.context, x, y, this.gravitonSize, this.gravitonSize, iFrame);
    }
    startVictoryAnimation(thenCallback: () => any) {
        this.victoryAnimation = new VictoryAnimation(this, () => {
            this.victoryAnimation = undefined;
            thenCallback();
        });
    }
    startVictoryAnimationAsync(): Promise<void> {
        return new Promise((resolve) => {
            this.startVictoryAnimation(resolve);
        })
    }

    render(time: number) {
        if (this.victoryAnimation) {
            this.victoryAnimation.frame(time);
            return;
        }
        this.context.fillStyle = 'black';
        this.drawBackground();

        this.drawBall(this.data.ballNow);
        this.drawBar(this.data.barsNow[0]);
        this.drawBar(this.data.barsNow[1]);
        for (let graviton of this.data.gravitonsNow.values()) {
            this.drawGraviton(graviton);
        }
    }
}

