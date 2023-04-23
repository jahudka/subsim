import { gainToDb } from '../utils';
import { Arrival, ArrivalMap } from './arrivalMap';
import { EventEmitter } from './eventEmitter';
import { GainMap } from './gainMap';

export class ContextRenderer extends EventEmitter {
  private readonly arrivals: ArrivalMap;
  private readonly gainMap: GainMap;
  private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private frame?: number;
  private x: number = 0;
  private y: number = 0;

  constructor(arrivals: ArrivalMap, gainMap: GainMap) {
    super();
    this.arrivals = arrivals;
    this.gainMap = gainMap;
    this.renderFrame = this.renderFrame.bind(this);
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

  render(x: number, y: number): void {
    this.x = x;
    this.y = y;

    if (this.frame === undefined) {
      this.frame = requestAnimationFrame(this.renderFrame);
    }
  }

  private renderFrame(): void {
    this.frame = undefined;
    const gain = this.gainMap.get(this.x, this.y);
    const arrivals: Arrival[] = [];
    const delayRange = 0.1;
    const gainRange = 54;
    const minGain = -48;
    const textWidth = 60;
    const textPad = 10;
    const w = this.width - textPad - textWidth;
    let t0: number = delayRange;

    for (const [source, arrival] of this.arrivals.get(this.x, this.y)) {
      const delay = source.delay.value / 1000 + arrival.delay;
      const gain = source.gain.value + gainToDb(arrival.gain) - minGain;

      if (gain >= 0) {
        arrivals.push({ delay, gain });
        delay < t0 && (t0 = delay);
      }
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#999';
    this.ctx.fillRect(textWidth + textPad, this.height / 2, w, 1);

    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = '#000';
    this.ctx.font = '14px/1 "Source Sans Pro"';
    this.ctx.fillText(`${gain.toFixed(2).replace(/infinity/i, 'inf')} dB`, textWidth, this.height / 2);

    for (const { delay, gain } of arrivals) {
      const t = delay - t0;
      const h = this.height * gain / gainRange;

      if (t < delayRange) {
        this.ctx.fillRect(textWidth + textPad + w * t / delayRange, (this.height - h) / 2, 1, h);
      }
    }

    this.emit('rendered');
  }
}
