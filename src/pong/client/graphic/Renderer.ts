import { Direction, GSettings, LEFT, RIGHT } from "../../common/constants";
import {
  BallData,
  BarData,
  GameDataBuffer,
  GravitonData,
  PortalData,
  PortalHalfData,
} from "../../common/entities/data";
import { MultiframeSprite } from "./MultiframeSprite";
import { VictoryAnimation } from "./animation";
import { ScorePanels } from "./score";

export class Renderer {
  context: CanvasRenderingContext2D;
  ratio: number;
  background: ImageData;
  ballRadius: number;
  barWidth: number;
  barHeight: number;
  gravitonSize: number;
  gravitonAnimationOpening: MultiframeSprite;
  gravitonAnimationPulling: MultiframeSprite;
  portalHeight: number;
  scoreSize: number;
  victoryAnimation?: VictoryAnimation;
  scorePanels: ScorePanels;

  constructor(public canvas: HTMLCanvasElement, public data: GameDataBuffer) {
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.gravitonAnimationOpening = new MultiframeSprite(
      "/public/img/graviton_opening.png",
      128,
      128,
      10
    );
    this.gravitonAnimationPulling = new MultiframeSprite(
      "/public/img/graviton_pulling.png",
      128,
      128,
      9
    );
    this.scorePanels = new ScorePanels();
  }

  handleResize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ratio = width / GSettings.SCREEN_WIDTH;
    this.ballRadius = this.ratio * GSettings.BALL_RADIUS;
    this.barWidth = this.ratio * GSettings.BAR_WIDTH;
    this.barHeight = this.ratio * GSettings.BAR_HEIGHT;
    this.gravitonSize = this.ratio * GSettings.GRAVITON_SIZE;
    this.portalHeight = this.ratio * GSettings.PORTAL_HEIGHT;
    this.scoreSize = this.ratio * GSettings.SCORE_SIZE;
    this.createBackground();
  }

  createBackground() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const blockSize = this.canvas.height / GSettings.BACKGROUND_N_SUBDIVISIONS;

    this.context.fillStyle = "rgb(0, 0, 0, 255)";
    this.context.fillRect(0, 0, width, height);

    this.context.fillStyle = GSettings.BACKGROUND_COLOR_GREY;
    this.context.fillRect(0, 0, width, blockSize);
    this.context.fillRect(0, height - blockSize, width, blockSize);

    for (let step = 1; step < GSettings.BACKGROUND_N_SUBDIVISIONS; step += 2) {
      this.context.fillRect(
        width / 2 - blockSize / 2,
        step * blockSize,
        blockSize,
        blockSize
      );
    }
    this.background = this.context.getImageData(0, 0, width, height);
  }

  drawBackground() {
    this.context.putImageData(this.background, 0, 0);
  }

  gameToCanvasCoord(x: number, y: number) {
    return [
      this.ratio * (x - GSettings.SCREEN_LEFT),
      this.ratio * (y - GSettings.SCREEN_TOP),
    ];
  }

  drawBall(ball: BallData) {
    this.context.fillStyle = GSettings.BALL_COLOR;
    const [x, y] = this.gameToCanvasCoord(ball.x, ball.y);
    this.context.beginPath();
    this.context.ellipse(
      x,
      y,
      this.ballRadius,
      this.ballRadius,
      0,
      0,
      2 * Math.PI
    );
    this.context.fill();
  }

  drawBar(bar: BarData) {
    this.context.fillStyle = GSettings.BAR_COLOR;
    const [x1, y1] = this.gameToCanvasCoord(
      bar.x - GSettings.BAR_WIDTH / 2,
      bar.y - GSettings.BAR_HEIGHT / 2
    );
    this.context.fillRect(x1, y1, this.barWidth, this.barHeight);
  }

  drawGraviton(graviton: GravitonData) {
    const [x, y] = this.gameToCanvasCoord(
      graviton.x - GSettings.GRAVITON_SIZE / 2,
      graviton.y - GSettings.GRAVITON_SIZE / 2
    );
    let iFrame = Math.floor(graviton.age / 5);
    if (iFrame < this.gravitonAnimationOpening.nFrames) {
      this.drawGravitonOpening(x, y, iFrame);
      return;
    }
    iFrame -= this.gravitonAnimationOpening.nFrames;
    if (
      GSettings.GRAVITON_LIFESPAN - graviton.age >=
      5 * this.gravitonAnimationOpening.nFrames
    ) {
      this.drawGravitonPulling(x, y, iFrame);
      return;
    }
    iFrame = Math.floor((GSettings.GRAVITON_LIFESPAN - graviton.age) / 5);
    this.drawGravitonOpening(x, y, iFrame);
  }

  drawGravitonOpening(x: number, y: number, iFrame: number) {
    this.gravitonAnimationOpening.draw(
      this.context,
      x,
      y,
      this.gravitonSize,
      this.gravitonSize,
      iFrame
    );
  }

  drawGravitonPulling(x: number, y: number, iFrame: number) {
    this.gravitonAnimationPulling.draw(
      this.context,
      x,
      y,
      this.gravitonSize,
      this.gravitonSize,
      iFrame
    );
  }

  drawPortal(portal: PortalData) {
    this.drawPortalHalf(portal.parts[0], LEFT);
    this.drawPortalHalf(portal.parts[1], RIGHT);
  }

  drawPortalHalf(portalHalf: PortalHalfData, side: Direction) {
    const width = 0.2 * this.portalHeight;
    const [x, y] = this.gameToCanvasCoord(
      portalHalf.x - (0.2 * GSettings.PORTAL_HEIGHT) / 2,
      portalHalf.y - GSettings.PORTAL_HEIGHT / 2
    );
    this.context.fillStyle = "rgb(255, 255, 255)";
    this.context.fillRect(x, y, width, this.portalHeight);
  }

  drawScore(
    xGame: number = GSettings.SCORE_X,
    yGame: number = GSettings.SCORE_Y,
    scale: number = 1
  ) {
    const [x, y] = this.gameToCanvasCoord(xGame, yGame);
    this.scorePanels.draw(this.context, x, y, this.scoreSize * scale);
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
    });
  }

  render(time: number) {
    if (this.victoryAnimation) {
      this.victoryAnimation.frame(time);
      return;
    }
    this.drawBackground();

    this.drawBall(this.data.current.ball);
    this.drawBar(this.data.current.bars[0]);
    this.drawBar(this.data.current.bars[1]);
    for (let graviton of this.data.current.gravitons.values()) {
      this.drawGraviton(graviton);
    }
    for (let portal of this.data.current.portals.values()) {
      this.drawPortal(portal);
    }
    this.drawScore();
  }
}
