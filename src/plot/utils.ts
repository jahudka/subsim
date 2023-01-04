import { RefObject, useRef } from 'react';
import { AreaConfig, SimulationOptions, useArea, useSimulation } from '../state';

export function distance(ax: number, ay: number, bx: number, by: number): number {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

export function dbToGain(db: number): number {
  return 10 ** (db / 20);
}

export function gainToDb(gain: number): number {
  return 20 * Math.log10(gain);
}

export function color(spl: number): string {
  const hue = 270 * Math.min(1, Math.max(0, (6 - spl) / 54));
  return `hsl(${hue.toFixed(2)}, 100%, 50%)`;
}

export function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number): void {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function rotate(ctx: CanvasRenderingContext2D, cx: number, cy: number, angle: number): boolean {
  if (angle) {
    ctx.translate(cx, cy);
    ctx.rotate(angle * Math.PI / 180);
    ctx.translate(-cx, -cy);
    return true;
  } else {
    return false;
  }
}

export function swapAxes<T>(orientation: 'portrait' | 'landscape', x: T, y: T): [T, T] {
  return orientation === 'landscape' ? [y, x] : [x, y];
}

export function adjustRotation(orientation: 'portrait' | 'landscape', angle: number): number {
  return orientation === 'portrait' ? -90 - angle : angle;
}

export type UiPrimitives = Omit<AreaConfig, 'depth'> & SimulationOptions & {
  ref: RefObject<HTMLCanvasElement>;
  height: number;
  w: number;
  h: number;
};

export function useUiPrimitives(): UiPrimitives {
  const { orientation, scale, width: aw, depth: ad, x0: ax0, y0: ay0 } = useArea();
  const { resolution, frequency } = useSimulation();
  const ref = useRef<HTMLCanvasElement>(null);

  const [width, height] = swapAxes(orientation, aw, ad);
  const [x0, y0] = swapAxes(orientation, ax0, ay0);

  const [w, h] = swapAxes(
    orientation,
    resolution * Math.floor(aw * scale / resolution),
    resolution * Math.floor(ad * scale / resolution),
  );

  return {
    orientation,
    resolution,
    frequency,
    scale,
    width,
    height,
    x0,
    y0,
    w,
    h,
    ref,
  };
}
