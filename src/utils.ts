export const $id = Symbol('$id');
export const $expr = Symbol('$expr');
export const $vars = Symbol('$vars');

export function deg(value: number): number {
  return 180 * value / Math.PI;
}

export function rad(value: number): number {
  return Math.PI * value / 180;
}
