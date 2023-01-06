import { FC, useEffect } from 'react';
import { Source, useSources } from '../state';
import { useUiPrimitives } from './ui-utils';
import { adjustRotation, rotate, swapAxes } from './utils';

export const PlotSourcesUI: FC = () => {
  const { orientation, scale, x0, y0, w, h, ref } = useUiPrimitives();
  const sources = useSources();

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    ctx && renderSourcesUI(ctx, orientation, scale, w, h, x0, y0, sources);
  }, [ref.current, orientation, scale, w, h, x0, y0, sources]);

  return <canvas ref={ref} className="plot-sources-ui" width={w} height={h} />;
};

function renderSourcesUI(
  ctx: CanvasRenderingContext2D,
  orientation: 'portrait' | 'landscape',
  scale: number,
  w: number,
  h: number,
  x0: number,
  y0: number,
  sources: Source[],
): void {
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const source of sources) {
    const [x, y] = swapAxes(orientation, source.x.value, source.y.value);
    const sx = (x0 + x) * scale, sy = (y0 + y) * scale;
    const sw = scale * source.width.value + 1;
    const sd = scale * source.depth.value + 1;
    const r = rotate(ctx, sx, h - sy, adjustRotation(orientation, -source.angle.value));
    ctx.strokeStyle = source.enabled ? '#000' : '#555';
    ctx.fillStyle = source.enabled ? '#000' : '#555';
    ctx.strokeRect(sx - sd, h - sy - sw / 2, sd, sw);
    ctx.fillText('→', sx - sd / 2, h - sy);
    r && ctx.resetTransform();
  }
}
