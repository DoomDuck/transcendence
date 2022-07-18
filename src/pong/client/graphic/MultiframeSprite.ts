export class MultiframeSprite {
  img: HTMLImageElement;
  imgReady: boolean = false;

  constructor(
    src: string,
    public frameWidth: number,
    public frameHeight: number,
    public nFrames: number
  ) {
    this.img = new Image();
    this.img.src = src;
    this.img.onload = () => {
      this.imgReady = true;
    };
    this.img.onerror = function () {
      console.log(`Error loading ${src}`);
    };
  }

  draw(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    iFrame: number
  ) {
    if (!this.imgReady) return;
    iFrame = iFrame % this.nFrames;
    context.drawImage(
      this.img,
      this.frameWidth * iFrame,
      0,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      w,
      h
    );
  }
}
