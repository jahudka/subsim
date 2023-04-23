import { dbToColor } from './utils';

export class LegendRenderer {
  private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private frame?: number;
  private range: number = 54;
  private step?: number;

  constructor() {
    this.render = this.render.bind(this);
  }

  setContext(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void {
    this.ctx = ctx;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
    this.render();
  }

  setCanvasSize(width: number, height: number): void {
    if (this.ctx) {
      this.width = this.ctx.canvas.width = width;
      this.height = this.ctx.canvas.height = height;
    }
  }

  setOptions(range: number, step?: number): void {
    if (range !== this.range || step !== this.step) {
      this.range = range;
      this.step = step;
      this.frame !== undefined && cancelAnimationFrame(this.frame);
      this.frame = requestAnimationFrame(this.render);
    }
  }

  private render(): void {
    this.frame = undefined;

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = '10px/1 Source Sans Pro';

    const { width: tw } = this.ctx.measureText('+00 dB');
    const vpad = 10;
    const height = this.height - 2 * vpad - 1;
    let tick = 6;

    for (let y = 0; y <= height; ++y) {
      const gain = 6 - this.range * (y / height);
      this.ctx.fillStyle = dbToColor(gain, this.range, this.step);
      this.ctx.fillRect(0, y + vpad, this.width - tw - 2, 1);

      if (gain <= tick) {
        this.ctx.fillStyle = '#555';
        this.ctx.fillText(`${tick} dB`, this.width, y + 2 + vpad);
        tick -= 6;
      }
    }
  }
}
