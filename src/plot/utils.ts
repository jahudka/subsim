import type { Orientation } from '../state';
import { rad } from '../utils';

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
    ctx.rotate(rad(angle));
    ctx.translate(-cx, -cy);
    return true;
  } else {
    return false;
  }
}

export function swapAxes<T>(orientation: Orientation, x: T, y: T): [T, T] {
  return orientation === 'landscape' ? [y, x] : [x, y];
}

export function adjustRotation(orientation: Orientation, angle: number, rad: boolean = false): number {
  return orientation === 'portrait' ? (rad ? -Math.PI / 2 : -90) - angle : angle;
}
