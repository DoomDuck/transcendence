import { Direction, GSettings } from "../../common/constants";

/**
 * The canvas surface used to draw one number
 * (the score of a single player)
 */
export class SingleNumberPanel {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  ratio!: number;
  value: number = 0;
  height: number;
  width!: number;

  constructor(public drawDirection: Direction) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = GSettings.SCORE_PANEL_CANVAS_WIDTH;
    this.canvas.height = GSettings.SCORE_PANEL_CANVAS_HEIGHT;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.context.textBaseline = "top";
    this.context.fillStyle = GSettings.SCORE_PANEL_CANVAS_FILLSTYLE;
    this.context.font = GSettings.SCORE_PANEL_CANVAS_FONT;
    this.height = this.canvas.height;
    this.setValue(0);
  }

  setValue(value: number) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillText(value.toString(), 0, 0);
    this.width = this.context.measureText(value.toString()).width;
    this.ratio = this.width / this.height;
    this.value = value;
  }

  increment() {
    this.setValue(this.value + 1);
  }

  draw(
    mainContext: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number
  ) {
    let xTarget =
      this.drawDirection == Direction.LEFT ? x - this.ratio * size : x;
    mainContext.drawImage(
      this.canvas,
      0,
      0,
      this.width,
      this.height,
      xTarget,
      y - size / 2,
      this.ratio * size,
      size
    );
  }
}

/**
 * The renderer for the score of both players
 * Used in Renderer
 */
export class ScorePanels {
  panel1: SingleNumberPanel = new SingleNumberPanel(Direction.LEFT);
  panel2: SingleNumberPanel = new SingleNumberPanel(Direction.RIGHT);

  goalAgainst(playerId: number) {
    if (playerId == 0) this.panel2.increment();
    else this.panel1.increment();
  }

  draw(
    mainContext: CanvasRenderingContext2D,
    x2: number,
    y: number,
    size: number
  ) {
    let x1 = mainContext.canvas.width - x2;
    this.panel1.draw(mainContext, x1, y, size);
    this.panel2.draw(mainContext, x2, y, size);
  }
}
