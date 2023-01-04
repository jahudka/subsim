export function deg(value: number): number {
  return 180 * value / Math.PI;
}

export function rad(value: number): number {
  return Math.PI * value / 180;
}
