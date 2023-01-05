import { FC, useEffect } from 'react';
import { Guide, useGuides } from '../state';
import { adjustRotation, drawLine, rotate, swapAxes, useUiPrimitives } from './utils';

export const PlotUI: FC = () => {
  const { orientation, resolution, scale, width, height, x0, y0, w, h, ref } = useUiPrimitives();
  const guides = useGuides();

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    ctx && renderPlotUI(ctx, orientation, scale, width, height, x0, y0, resolution, guides, w, h);
  }, [ref.current, orientation, scale, width, height, x0, y0, resolution, guides, w, h]);

  return <canvas ref={ref} className="plot-ui" width={w} height={h} />;
};

function renderPlotUI(
  ctx: CanvasRenderingContext2D,
  orientation: 'landscape' | 'portrait',
  scale: number,
  width: number,
  height: number,
  x0: number,
  y0: number,
  resolution: number,
  guides: Guide[],
  w: number,
  h: number,
): void {
  ctx.clearRect(0, 0, w, h);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(0.5, 0.5, w - 1, h - 1);

  renderAxes(ctx, scale, width, height, x0, y0, w, h);
  renderAxesLegend(ctx, orientation, w);
  renderGuides(ctx, orientation, scale, x0, y0, w, h, guides);
}

const minAxisStep = 10;

function renderAxes(
  ctx: CanvasRenderingContext2D,
  scale: number,
  width: number,
  height: number,
  x0: number,
  y0: number,
  w: number,
  h: number,
): void {
  ctx.strokeStyle = '#777';
  ctx.fillStyle = '#777';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'hanging';

  const ax = x0 * scale;
  const ay = y0 * scale;
  const step = Math.ceil(minAxisStep / scale);

  drawLine(ctx, 0, h - (ay + 0.5), w, h - (ay + 0.5));
  drawLine(ctx, ax + 0.5, 0, ax + 0.5, h);

  for (let xm = -Math.floor(x0 - 0.5), x1 = xm + width - 1; xm < x1; xm += step) {
    if (xm === 0) continue;
    const label = Math.abs(xm) % 5 === 0, s = label ? 5 : 2, x = Math.round(ax + xm * scale) + 0.5;
    drawLine(ctx, x, h - (ay - s), x, h - (ay + s + 1));
    label && ctx.fillText(xm.toString(), x, h - ay + 10);
  }

  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  for (let ym = -Math.floor(y0 - 0.5), y1 = ym + height - 1; ym < y1; ym += step) {
    if (ym === 0) continue;
    const label = Math.abs(ym) % 5 === 0, s = label ? 5 : 2, y = Math.round(ay + ym * scale) + 0.5;
    drawLine(ctx, ax - s, h - y, ax + s + 1, h - y);
    label && ctx.fillText(ym.toString(), ax - 10, h - y);
  }
}

const len = 80;

function renderAxesLegend(
  ctx: CanvasRenderingContext2D,
  orientation: 'landscape' | 'portrait',
  w: number,
): void {
  ctx.strokeStyle = '#333';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'hanging';

  drawArrow(ctx, w - 15 - len, 15 + len / 2 + 0.5, w - 15, 15 + len / 2 + 0.5);
  drawArrow(ctx, w - 15 - len / 2 + 0.5, 15 + len, w - 15 - len / 2 + 0.5, 15);

  const [x, y] = swapAxes(orientation, 'x / width', 'y / depth');
  ctx.fillText(x, w - 10, 15 + len / 2 + 5);
  ctx.fillText(y, w - 15 - len / 2 - 5, 10);
}

function drawArrow(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const da = Math.PI * 5/6;
  const r = 5;

  drawLine(ctx, x1, y1, x2, y2);
  drawLine(ctx, x2, y2, x2 + r * Math.cos(a + da), y2 + r * Math.sin(a + da));
  drawLine(ctx, x2, y2, x2 + r * Math.cos(a - da), y2 + r * Math.sin(a - da));
}

function renderGuides(
  ctx: CanvasRenderingContext2D,
  orientation: 'landscape' | 'portrait',
  scale: number,
  x0: number,
  y0: number,
  w: number,
  h: number,
  guides: Guide[],
): void {
  for (const guide of guides) {
    const [x, y] = swapAxes(orientation, guide.x.value, guide.y.value);
    const gx = (x0 + x) * scale, gy = (y0 + y) * scale;

    switch (guide.kind) {
      case 'rect': {
        const gw = guide.width.value * scale;
        const gh = guide.height.value * scale;
        let r = rotate(ctx, gx, h - gy, adjustRotation(orientation, 180 - guide.angle.value));

        ctx.fillStyle = '#ffffff55';
        ctx.strokeStyle = guide.color;
        ctx.fillRect(gx - gh / 2, h - gy - gw / 2, gh, gw);
        ctx.strokeRect(gx - gh / 2, h - gy - gw / 2, gh, gw);

        if (guide.label) {
          gw > gh && (r = rotate(ctx, gx, h - gy, -90) || r);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = guide.color;
          ctx.fillText(guide.label, gx, h - gy);
        }

        r && ctx.resetTransform();
        break;
      }
      case 'line': {
        const r = rotate(ctx, gx, h - gy, adjustRotation(orientation, -guide.angle.value));

        ctx.strokeStyle = guide.color;
        drawLine(ctx, gx - Math.max(w, h), h - gy, gx + Math.max(w, h), h - gy);

        if (guide.label) {
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = guide.color;
          ctx.fillText(guide.label, gx, h - gy);
        }

        r && ctx.resetTransform();
        break;
      }
    }
  }
}

