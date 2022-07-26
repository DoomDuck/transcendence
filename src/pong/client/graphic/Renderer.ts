import { Direction, GSettings, LEFT, RIGHT } from "../../common/constants";
import {
  BallData,
  BarData,
  GameDataBuffer,
  GravitonData,
  PortalData,
  PortalHalfData,
  type Spawnable,
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
  portalAnimation: MultiframeSprite;
  portalHeight: number;
  portalWidth: number;
  scoreSize: number;
  victoryAnimation?: VictoryAnimation;
  scorePanels: ScorePanels;

  constructor(public canvas: HTMLCanvasElement, public data: GameDataBuffer) {
    this.context = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.gravitonAnimationOpening = new MultiframeSprite(
      "/public/img/graviton_opening.png",
      GSettings.GRAVITON_SPRITE_WIDTH,
      GSettings.GRAVITON_SPRITE_HEIGHT,
      10
    );
    this.gravitonAnimationPulling = new MultiframeSprite(
      "/public/img/graviton_pulling.png",
      GSettings.GRAVITON_SPRITE_WIDTH,
      GSettings.GRAVITON_SPRITE_HEIGHT,
      9
    );
    this.portalAnimation = new MultiframeSprite(
      "/public/img/portal.png",
      GSettings.PORTAL_SPRITE_WIDTH,
      GSettings.PORTAL_SPRITE_HEIGHT,
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
    this.portalWidth = this.ratio * GSettings.PORTAL_WIDTH;
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

  decideFrameSpawnable(spawnable: Spawnable, nFramesOpening: number) {
    let iFrame = Math.floor(spawnable.age / 5);
    if (iFrame < nFramesOpening)
      return { iFrame: iFrame, animationPhase: "opening" };
    const iFrameClosing = Math.floor((spawnable.lifespan - spawnable.age) / 5);
    if (iFrameClosing < nFramesOpening)
      return { iFrame: iFrameClosing, animationPhase: "closing" };
    iFrame -= nFramesOpening;
    return { iFrame: iFrame, animationPhase: "middle" };
  }

  drawGraviton(graviton: GravitonData) {
    const [x, y] = this.gameToCanvasCoord(
      graviton.x - GSettings.GRAVITON_SIZE / 2,
      graviton.y - GSettings.GRAVITON_SIZE / 2
    );
    let { iFrame, animationPhase } = this.decideFrameSpawnable(
      graviton,
      this.gravitonAnimationOpening.nFrames
    );
    const animation =
      animationPhase == "middle"
        ? this.gravitonAnimationPulling
        : this.gravitonAnimationOpening;
    if (animationPhase == "middle")
      iFrame %= this.gravitonAnimationPulling.nFrames;
    animation.draw(
      this.context,
      x,
      y,
      this.gravitonSize,
      this.gravitonSize,
      iFrame
    );
  }

  drawPortal(portal: PortalData, side: number) {
    const portalHalf = portal.parts[side];
    const [x, y] = this.gameToCanvasCoord(
      portalHalf.x - GSettings.PORTAL_WIDTH / 2,
      portalHalf.y - GSettings.PORTAL_HEIGHT / 2
    );
    let { iFrame, animationPhase } = this.decideFrameSpawnable(
      portal,
      this.portalAnimation.nFrames
    );
    if (animationPhase == "middle") iFrame = this.portalAnimation.nFrames - 1;
    this.portalAnimation.draw(
      this.context,
      x,
      y,
      this.portalWidth,
      this.portalHeight,
      iFrame
    );
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

    this.drawBar(this.data.current.bars[0]);
    this.drawBar(this.data.current.bars[1]);
    for (let graviton of this.data.current.gravitons.values()) {
      this.drawGraviton(graviton);
    }
    for (let portal of this.data.current.portals.values()) {
      this.drawPortal(portal, 0);
      this.drawPortal(portal, 1);
    }
    this.drawBall(this.data.current.ball);
    this.drawScore();
  }
}
