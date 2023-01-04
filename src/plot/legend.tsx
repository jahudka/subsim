import { FC, useEffect, useRef } from 'react';
import { color } from './utils';

const legendWidth = 50;
const legendHeight = 240;

export const Legend: FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    ctx && renderLegend(ctx);
  }, [ref.current]);

  return (
    <canvas ref={ref} className="legend" width={legendWidth} height={legendHeight} />
  );
};

function renderLegend(ctx: CanvasRenderingContext2D): void {
  ctx.clearRect(0, 0, legendWidth, legendHeight);
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  for (let y = 0; y >= -54; --y) {
    ctx.fillStyle = color(y + 6);
    ctx.fillRect(0, 10 - 4 * y, 15, 4);

    if (Math.abs(y) % 6 === 0) {
      ctx.fillStyle = '#000';
      ctx.fillText(`${y+6} dB`, 48, 12 - 4 * y);
    }
  }
}
