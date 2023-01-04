import { FC, useEffect } from 'react';
import { GainMap, useGainMap } from './gainMap';
import { color, useUiPrimitives } from './utils';

export const PlotSources: FC = () => {
  const { orientation, resolution, w, h, ref } = useUiPrimitives();
  const map = useGainMap();

  useEffect(() => {
    const ctx = ref.current?.getContext('2d');
    ctx && renderSources(ctx, orientation, resolution, w, h, map);
  }, [ref.current, orientation, resolution, w, h, map]);

  return <canvas ref={ref} className="plot-sources" width={w} height={h} />;
};



function renderSources(
  ctx: CanvasRenderingContext2D,
  orientation: 'portrait' | 'landscape',
  resolution: number,
  w: number,
  h: number,
  map?: GainMap,
): void {
  ctx.clearRect(0, 0, w, h);

  if (!map) {
    return;
  }

  for (let x = resolution / 2; x <= w - resolution / 2; x += resolution) {
    for (let y = resolution / 2; y <= h - resolution / 2; y += resolution) {
      ctx.fillStyle = color(map.get(x)!.get(y)!);
      ctx.fillRect(x - resolution / 2, h - y - resolution / 2, resolution, resolution);
    }
  }
}
