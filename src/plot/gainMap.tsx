import { createContext, FC, useContext, useMemo, useRef } from 'react';
import { Guide, Orientation, Source, useGlobals, useGuides, useSources } from '../state';
import { Children } from '../types';
import { adjustRotation, dbToGain, distance, gainToDb, swapAxes, useUiPrimitives } from './utils';

export type GainMap = Map<number, Map<number, number>>;

const Ctx = createContext<GainMap | undefined>(undefined);

export function useGainMap(): GainMap | undefined {
  return useContext(Ctx);
}

type ReflectionMap = Map<Source, Map<Guide, Source>>;

export const GainMapProvider: FC<Children> = ({ children }) => {
  const { orientation, resolution, frequency, scale, x0, y0, w, h } = useUiPrimitives();
  const { $c: { value: $c } } = useGlobals();
  const reflections = useRef<ReflectionMap>();
  const arrivals = useRef<ArrivalMap>();
  const walls = useGuides()
    .filter((guide) => guide.kind === 'line' && guide.reflect);
  const sources = useSources()
    .filter((source) => source.enabled)
    .flatMap((source) => resolveReflections(reflections.current ??= new Map(), orientation, source, walls));

  useMemo(() => {
    reflections.current?.clear();
    arrivals.current?.clear();
  }, [orientation, resolution, scale, x0, y0, w, h, $c]);

  const map = useMemo(
    () => computeGainMap(orientation, resolution, frequency, scale, $c, w, h, x0, y0, sources, arrivals.current ??= new Map(), reflections.current ??= new Map()),
    [arrivals, reflections, orientation, resolution, frequency, scale, $c, w, h, x0, y0, sources],
  );

  return (
    <Ctx.Provider value={map}>{children}</Ctx.Provider>
  );
};

type ArrivalPoint = {
  gain: number;
  delay: number;
};

type ArrivalMapY = Map<number, ArrivalPoint>;
type ArrivalMapX = Map<number, ArrivalMapY>;
type ArrivalMap = Map<Source, ArrivalMapX>;

function computeGainMap(
  orientation: Orientation,
  resolution: number,
  frequency: number,
  scale: number,
  $c: number,
  w: number,
  h: number,
  x0: number,
  y0: number,
  sources: Source[],
  arrivals: ArrivalMap,
  reflections: ReflectionMap,
): GainMap | undefined {
  if (!sources.length) {
    arrivals.clear();
    return undefined;
  }

  const map: GainMap = new Map();

  for (let x = resolution / 2; x <= w - resolution / 2; x += resolution) {
    const xmap: Map<number, number> = new Map();

    for (let y = resolution / 2; y <= h - resolution / 2; y += resolution) {
      // This amazing algorithm was derived from https://ccrma.stanford.edu/~jos/filters/Proof_Using_Trigonometry.html
      // 'ac' and 'as' are 'x' and 'y' - the sums of cosines and sines of each wave's phase multiplied by its gain
      const [ac, as] = sources.reduce(([ac, as], s) => {
        const b = getArrivals(arrivals, s, orientation, resolution, scale, $c, w, h, x0, y0).get(x)!.get(y)!;
        const p = 2 * Math.PI * (frequency * (s.delay.value / 1000 + b.delay) + (s.invert ? 0.5 : 0));
        return [ac + b.gain * Math.cos(p), as + b.gain * Math.sin(p)];
      }, [0, 0]);

      xmap.set(y, gainToDb(Math.sqrt(ac ** 2 + as ** 2)));
    }

    map.set(x, xmap);
  }

  for (const source of arrivals.keys()) {
    if (!sources.includes(source)) {
      arrivals.delete(source);
    }
  }

  for (const source of reflections.keys()) {
    if (!sources.includes(source)) {
      reflections.delete(source);
    }
  }

  return map;
}

function resolveReflections(
  map: ReflectionMap,
  orientation: 'landscape' | 'portrait',
  source: Source,
  walls: Guide[],
): Source[] {
  map.has(source) || map.set(source, new Map());
  const reflections: Map<Guide, Source> = map.get(source)!;

  for (const wall of walls) {
    if (!reflections.has(wall)) {
      reflections.set(wall, reflect(source, wall, orientation));
    }
  }

  for (const wall of reflections.keys()) {
    if (!walls.includes(wall)) {
      reflections.delete(wall);
    }
  }

  return [source, ...reflections.values()];
}

function reflect(source: Source, wall: Guide, orientation: 'landscape' | 'portrait'): Source {
  const [sx, sy] = swapAxes(orientation, source.x.value, source.y.value);
  const [wx, wy] = swapAxes(orientation, wall.x.value, wall.y.value);
  const a = Math.tan(Math.PI * adjustRotation(orientation, wall.angle.value) / 180);

  if (Number.isNaN(a)) {
    return {
      ...source,
      x: { value: 2 * wx - sx, source: '' },
      y: { value: sy, source: '' },
    };
  }

  const b = 1, c = -a * wx + wy;
  const m = Math.sqrt(a ** 2 + b ** 2);
  const an = a / m, bn = b / m, cn = c / m;
  const d = an * sx + bn * sy + cn;
  const [rx, ry] = swapAxes(orientation, sx - 2 * an * d, sy - 2 * bn * d);

  return {
    ...source,
    x: { value: rx, source: '' },
    y: { value: ry, source: '' },
  };
}

function getArrivals(
  arrivals: ArrivalMap,
  source: Source,
  orientation: Orientation,
  resolution: number,
  scale: number,
  $c: number,
  w: number,
  h: number,
  x0: number,
  y0: number,
): ArrivalMapX {
  const existing = arrivals.get(source);

  if (existing) {
    return existing;
  }

  const xMap: ArrivalMapX = new Map();

  for (let x = resolution / 2; x <= w - resolution / 2; x += resolution) {
    const yMap: ArrivalMapY = new Map();

    for (let y = resolution / 2; y <= h - resolution / 2; y += resolution) {
      const [sx, sy] = swapAxes(orientation, source.x.value, source.y.value);
      const dist = distance(x / scale, y / scale, sx + x0, sy + y0);
      const angle = Math.atan2(sy + y0 - y / scale, sx + x0 - x / scale) + source.angle.value * Math.PI / 180;

      yMap.set(y, {
        gain: dbToGain(source.gain.value) * source.model(adjustRotation(orientation, angle)) / Math.max(0.1, dist),
        delay: dist / $c,
      });
    }

    xMap.set(x, yMap);
  }

  arrivals.set(source, xMap);
  return xMap;
}

