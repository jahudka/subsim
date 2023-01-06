import { FC, MouseEvent } from 'react';
import { useGainMap } from './gainMap';
import { GainMap } from './types';
import { useUiPrimitives } from './ui-utils';

export const Tooltip: FC = () => {
  const { w, h, resolution } = useUiPrimitives();
  const map = useGainMap();
  return <canvas className="plot-tooltip" width={w} height={h} onMouseMove={(evt) => renderTooltip(evt, w, h, resolution, map)} />;
};

function renderTooltip(
  evt: MouseEvent<HTMLCanvasElement>,
  w: number,
  h: number,
  resolution: number,
  map?: GainMap,
): void {
  const ctx = evt.currentTarget.getContext('2d');

  if (!ctx) {
    return;
  }

  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (!map) {
    return;
  }

  const { left, top } = evt.currentTarget.getBoundingClientRect();
  const cx = evt.clientX - left;
  const cy = evt.clientY - top;
  const x = Math.round((cx - resolution / 2) / resolution) * resolution + resolution / 2;
  const y = h - Math.round((cy - resolution / 2) / resolution) * resolution + resolution / 2;
  const gain = map.get(x)?.get(y);

  if (gain !== undefined) {
    const tx = Math.max(30, Math.min(w - 30, cx));
    const ty = cy + (cy < 30 ? 25 : -15);
    ctx.fillStyle = '#ffffffaa';
    ctx.fillRect(tx - 23, ty - 8, 46, 16);
    ctx.fillStyle = '#000';
    ctx.fillText(`${gain.toFixed(1)} dB`, tx, ty);
  }
}
