export function roundToStep(gain: number, step?: number): number {
  return step ? Math.round(gain / step) * step : gain;
}

export function dbToColor(gain: number, range: number, step?: number): string {
  const hue = 270 * Math.min(1, Math.max(0, (6 - roundToStep(gain, step)) / range));
  return `hsl(${hue.toFixed(2)}, 100%, 50%)`;
}
