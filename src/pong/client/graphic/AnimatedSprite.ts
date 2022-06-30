import { Renderer } from "./Renderer";

export class AnimatedSprite {
    img: HTMLImageElement;
    imgReady: boolean = false;

    constructor(src: string,
        public frameWidth: number,
        public frameHeight: number,
        public nFrames: number)
    {
        this.img = new Image();
        this.img.src = src;
        this.img.onload = () => {
            this.imgReady = true;
            console.log("image w:", this.img.width);
            console.log("image h:", this.img.height);
        };
        this.img.onerror = function() {
            console.log(`Error loading ${src}`);
        };
    }

    draw(context: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, iFrame: number) {
        if (!this.imgReady)
            return;
        iFrame = iFrame % this.nFrames;
        context.drawImage(
            this.img,
            this.frameWidth * iFrame, 0,
            this.frameWidth, this.frameHeight,
            x, y,
            w, h
        );
    }
}