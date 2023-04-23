import { ViewState } from '../state';
import { EventEmitter } from './eventEmitter';
import { GainMap } from './gainMap';
import { dbToColor } from './utils';

export class PlotRenderer extends EventEmitter {
  private readonly gainMap: GainMap;
  private ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  private view: ViewState = { scale: 1, x0: 0, y0: 0 };
  private width: number = 0;
  private height: number = 0;
  private range: number = 54;
  private step?: number;
  private next?: number;

  constructor(gainMap: GainMap) {
    super();
    this.gainMap = gainMap;
  }

  setContext(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void {
    this.ctx = ctx;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
  }

  setCanvasSize(width: number, height: number): void {
    if (this.ctx) {
      this.width = this.ctx.canvas.width = width;
      this.height = this.ctx.canvas.height = height;
    }
  }

  setView(view: ViewState): void {
    this.view = view;
  }

  setOptions(range: number, step?: number): void {
    this.range = range;
    this.step = step;
  }

  abort(): void {
    if (this.next !== undefined) {
      cancelAnimationFrame(this.next);
      this.next = undefined;
    }
  }

  render(): void {
    this.abort();

    if (this.ctx) {
      this.next = requestAnimationFrame(() => this.renderFrame(32, 0, true));
    }
  }

  renderFrame(step: number, row: number = 0, first: boolean = false) {
    if (!this.ctx) {
      return;
    } else if (this.gainMap.isEmpty()) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      return;
    }

    const t0 = Date.now();

    while (step >= 1) {
      const offset = step < 2 ? 0.5 : 1;

      for (let y = row * step; y < this.height; y += step) {
        if (row % 10 === 0 && Date.now() - t0 > 50) {
          this.next = requestAnimationFrame(() => this.renderFrame(step, row, first));
          return;
        }

        const [x0, dx] = first || (row % 2) ? [0, step] : [step, 2 * step];
        ++row;

        for (let x = x0; x < this.width; x += dx) {
          this.ctx.fillStyle = this.getColor(x, y);
          this.ctx.fillRect(x - step / 2 + offset, this.height - (y + step / 2 + offset), step, step);
        }
      }

      if (first) {
        this.emit('rendered');
      }

      step /= 2;
      row = 0;
      first = false;
    }
  }

  private getColor(x: number, y: number): string {
    let gain = this.gainMap.get(
      this.view.x0 + x / this.view.scale,
      this.view.y0 + y / this.view.scale,
    );

    return dbToColor(gain, this.range, this.step);
  }
}
