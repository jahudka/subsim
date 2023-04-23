export function getStep(min: number, max: number): number {
  const range = Math.abs(max - min);

  if (range >= 100) {
    return 1;
  }

  return 1 / 10 ** -Math.floor(Math.log10(range) - 2);
}
