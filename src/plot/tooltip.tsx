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
  ctx.textBaseline = 'bottom';

  if (!map) {
    return;
  }

  const { left, top } = evt.currentTarget.getBoundingClientRect();
  const cx = evt.clientX - left;
  const cy = evt.clientY - top;
  const x = Math.round((cx - resolution / 2) / resolution) * resolution + resolution / 2;
  const y = h - Math.round((cy - resolution / 2) / resolution) * resolution + resolution / 2;
  const point = map.get(x)?.get(y);

  if (point !== undefined) {
    const tw = 46;
    const th = 32;
    const margin = 5;
    const padding = 3;
    const tx = Math.max(margin + tw / 2, Math.min(w - margin - tw / 2, cx));
    const ty = cy + (cy < th + 2 * margin ? margin + 15 + th / 2 : -(margin + th / 2));
    const delayRange = 0.12;
    const gainRange = -36;
    const arrw = tw - 2 * padding;
    const arrh = th / 2 - 2 * padding;

    ctx.fillStyle = '#ffffffaa';
    ctx.fillRect(tx - tw / 2, ty - th / 2, tw, th);
    ctx.fillStyle = '#000';
    ctx.fillText(`${point.gain.toFixed(1)} dB`, tx, ty);

    for (const ap of point.arrivals) {
      if (ap.delay > delayRange || ap.gain < gainRange) {
        continue;
      }

      const ah = 1 - (ap.gain / gainRange);

      ctx.fillRect(
        tx - arrw / 2 + (ap.delay / delayRange) * arrw,
        ty + padding + (1 - ah) * arrh,
        1,
        ah * arrh,
      );
    }
  }
}
