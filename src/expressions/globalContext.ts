import { Context } from './context';

export class GlobalContext extends Context {
  constructor() {
    super();

    this.functions.set('min', (...args: number[]) => Math.min(...args));
    this.functions.set('max', (...args: number[]) => Math.max(...args));
    this.functions.set('clamp', (value: number, min: number, max: number) => Math.max(min, Math.min(max, value)));
    this.functions.set('abs', (value: number) => Math.abs(value));
    this.functions.set('sign', (value: number) => Math.sign(value));
    this.functions.set('round', (value: number) => Math.round(value));
    this.functions.set('floor', (value: number) => Math.floor(value));
    this.functions.set('ceil', (value: number) => Math.ceil(value));
    this.functions.set('sin', (value: number) => Math.sin(rad(value)));
    this.functions.set('cos', (value: number) => Math.cos(rad(value)));
    this.functions.set('tan', (value: number) => Math.tan(rad(value)));
    this.functions.set('asin', (value: number) => deg(Math.asin(value)));
    this.functions.set('acos', (value: number) => deg(Math.acos(value)));
    this.functions.set('atan', (value: number) => deg(Math.atan(value)));
    this.functions.set('atan2', (y: number, x: number) => deg(Math.atan2(y, x)));
    this.functions.set('deg', deg);
    this.functions.set('rad', rad);
  }
}

function deg(value: number): number {
  return 180 * value / Math.PI;
}

function rad(value: number): number {
  return Math.PI * value / 180;
}
