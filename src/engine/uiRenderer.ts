import { Guide, Source, ViewState } from '../state';
import { rad } from '../utils';

export class UiRenderer {
  private readonly sources: Map<string, Source> = new Map();
  private readonly guides: Map<string, Guide> = new Map();
  private ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  private view: ViewState = { scale: 1, x0: 0, y0: 0 };
  private width: number = 0;
  private height: number = 0;
  private frame?: number;

  constructor() {
    this.renderFrame = this.renderFrame.bind(this);
  }

  mergeSource(source: Source): void {
    this.sources.set(source.id, source);
  }

  deleteSource(id: string): void {
    this.sources.delete(id);
  }

  mergeGuide(guide: Guide): void {
    this.guides.set(guide.id, guide);
  }

  deleteGuide(id: string): void {
    this.guides.delete(id);
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

  clearAll(): void {
    this.sources.clear();
    this.guides.clear();
  }

  render(): void {
    this.frame !== undefined && cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(this.renderFrame);
  }

  private renderFrame(): void {
    if (!this.ctx) {
      return;
    }

    this.renderAxes();
    this.renderGuides();
    this.renderSources();
  }

  private renderAxes(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.ctx.strokeStyle = '#777';
    this.ctx.fillStyle = '#777';
    this.ctx.font = '10px/1 "Source Sans Pro", sans-serif';

    const step = this.computeStepSize();
    const x0 = Math.round(-this.view.x0 * this.view.scale);
    const y0 = Math.round(-this.view.y0 * this.view.scale);
    const x0bounded = Math.max(-1, Math.min(this.width, x0));
    const y0bounded = Math.max(-1, Math.min(this.height, y0));
    const xmin = Math.ceil(-x0 / step);
    const ymin = Math.ceil(-y0 / step);
    const xmax = Math.floor(xmin + this.width / step);
    const ymax = Math.floor(ymin + this.height / step);
    const vscale = 10 ** Math.ceil(Math.max(0, -Math.log10(step / this.view.scale)));
    const xly = y0 > 30 ? 5 : -5;
    const ylx = x0 > 30 ? -5 : 5;

    this.drawLine(0, y0 + 0.5, this.width, y0 + 0.5);
    this.drawLine(x0 + 0.5, 0, x0 + 0.5, this.height);

    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = xly < 0 ? 'bottom' : 'hanging';

    for (let i = xmin; i <= xmax; ++i) {
      if (i === 0) continue;
      const x = x0 + i * step, value = Math.round(vscale * (i * step) / this.view.scale) / vscale;
      this.drawLine(x + 0.5, y0bounded + 3, x + 0.5, y0bounded - 2);
      this.ctx.fillText(value.toString(), x, this.height - y0bounded + xly);
    }

    this.ctx.textAlign = ylx < 0 ? 'right' : 'left';
    this.ctx.textBaseline = 'middle';

    for (let i = ymin; i <= ymax; ++i) {
      if (i === 0) continue;
      const y = y0 + i * step, value = Math.round(vscale * (i * step) / this.view.scale) / vscale;
      this.drawLine(x0bounded - 2, y - 0.5, x0bounded + 3, y - 0.5);
      this.ctx.fillText(value.toString(), x0bounded + ylx, this.height - y);
    }
  }

  private renderGuides(): void {
    for (const guide of this.guides.values()) {
      const gx = (guide.x.value - this.view.x0) * this.view.scale;
      const gy = (guide.y.value - this.view.y0) * this.view.scale;

      switch (guide.kind) {
        case 'rect': {
          const gw = guide.width.value * this.view.scale;
          const gh = guide.height.value * this.view.scale;
          let r = this.rotate(gx, gy, guide.angle.value);

          this.ctx.fillStyle = '#ffffff55';
          this.ctx.strokeStyle = guide.color;
          this.ctx.fillRect(gx - gw / 2, this.height - gy - gh / 2, gw, gh);
          this.ctx.strokeRect(gx - gw / 2, this.height - gy - gh / 2, gw, gh);

          if (guide.label) {
            gh > gw && (r = this.rotate(gx, gy, -90) || r);
            this.renderLabel(guide.label, gx, gy, 'center', 'middle', guide.color);
          }

          r && this.ctx.resetTransform();
          break;
        }
        case 'line': {
          const r = this.rotate(gx, gy, guide.angle.value - 90);
          const s = Math.max(this.width, this.height);

          this.ctx.strokeStyle = guide.color;
          this.drawLine(gx - s, gy, gx + s, gy);
          guide.label && this.renderLabel(guide.label, gx, gy, 'left', 'bottom', guide.color);
          r && this.ctx.resetTransform();
          break;
        }
      }
    }
  }

  private renderSources(): void {
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'middle';

    for (const source of this.sources.values()) {
      const sx = (source.x.value - this.view.x0) * this.view.scale;
      const sy = (source.y.value - this.view.y0) * this.view.scale;
      const sw = this.view.scale * source.width.value + 1;
      const sd = this.view.scale * source.depth.value + 1;
      const r = this.rotate(sx, sy, source.angle.value - 90);
      this.ctx.strokeStyle = source.enabled ? '#000' : '#555';
      this.ctx.fillStyle = source.enabled ? '#000' : '#555';
      this.ctx.strokeRect(sx - sd, this.height - sy - sw / 2, sd, sw);
      this.ctx.fillText('→', sx, this.height - sy + 0.5);

      r && this.ctx.resetTransform();
    }
  }

  private renderLabel(
    label: string,
    x: number,
    y: number,
    align: CanvasTextAlign,
    baseline: CanvasTextBaseline,
    color?: string,
  ): void {
    this.ctx.textAlign = align;
    this.ctx.textBaseline = baseline;
    this.ctx.fillStyle = color ?? '#000';
    this.ctx.fillText(label, x, this.height - y);
  }

  private computeStepSize(): number {
    const target = 50;
    const e1 = Math.log10(target / this.view.scale);
    const e5 = Math.log10(target / (5 * this.view.scale));
    const e1n = Math.round(e1);
    const e5n = Math.round(e5);
    return Math.abs(e1 - e1n) < Math.abs(e5 - e5n)
      ? (this.view.scale * 10 ** e1n)
      : (this.view.scale * 5 * 10 ** e5n);
  }

  private drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, this.height - y1);
    this.ctx.lineTo(x2, this.height - y2);
    this.ctx.stroke();
  }

  private rotate(cx: number, cy: number, angle: number): boolean {
    if (angle) {
      this.ctx.translate(cx, this.height - cy);
      this.ctx.rotate(rad(angle));
      this.ctx.translate(-cx, cy - this.height);
      return true;
    } else {
      return false;
    }
  }
}
