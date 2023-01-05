import { createContext, FC, useContext, useMemo } from 'react';
import { useFirst } from '../hooks';
import {
  Guide,
  Line,
  models,
  Orientation,
  Source,
  useGlobals,
  useGuides,
  useSources,
} from '../state';
import { Children } from '../types';
import { rad } from '../utils';
import { adjustRotation, dbToGain, distance, gainToDb, swapAxes, useUiPrimitives } from './utils';

export type GainMap = Map<number, Map<number, number>>;

const Ctx = createContext<GainMap | undefined>(undefined);

export function useGainMap(): GainMap | undefined {
  return useContext(Ctx);
}

type ReflectionMap = Map<Source, Map<Line, Source>>;

function createReflectionMap(): ReflectionMap {
  return new Map();
}

function createArrivalMap(): ArrivalMap {
  return new Map();
}

function isReflectingLine(guide: Guide): guide is Line {
  return guide.kind === 'line' && guide.reflect;
}

export const GainMapProvider: FC<Children> = ({ children }) => {
  const { orientation, resolution, frequency, scale, x0, y0, w, h } = useUiPrimitives();
  const { $c: { value: $c } } = useGlobals();
  const reflections = useFirst(createReflectionMap);
  const arrivals = useFirst(createArrivalMap);
  const guides = useGuides();
  const walls = useMemo(() => guides.filter(isReflectingLine), [guides]);
  const sources = useSources();

  useMemo(() => {
    reflections.current.clear();
    arrivals.current.clear();
  }, [orientation, resolution, scale, x0, y0, w, h, $c]);

  const activeSources = useMemo(
    () => sources
      .filter((source) => source.enabled)
      .flatMap((source) => resolveReflections(reflections.current, source, walls)),
    [sources, walls]
  );

  const map = useMemo(
    () => computeGainMap(orientation, resolution, frequency, scale, $c, w, h, x0, y0, activeSources, arrivals.current, reflections.current),
    [arrivals, reflections, orientation, resolution, frequency, scale, $c, w, h, x0, y0, activeSources],
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
  source: Source,
  walls: Line[],
): Source[] {
  map.has(source) || map.set(source, new Map());
  const reflections: Map<Line, Source> = map.get(source)!;

  for (const wall of walls) {
    reflections.set(wall, reflect(source, wall));
  }

  for (const wall of reflections.keys()) {
    if (!walls.includes(wall)) {
      reflections.delete(wall);
    }
  }

  return [source, ...reflections.values()];
}

function reflect(source: Source, wall: Line): Source {
  const angle = -rad(wall.angle.value);
  const a = Math.sin(angle);
  const b = Math.cos(angle);
  const c = -wall.y.value * a - wall.x.value * b;
  const p = source.x.value;
  const q = source.y.value;
  const a2 = a ** 2;
  const b2 = b ** 2;
  const x = (p * (a2 - b2) - 2 * b * (a * q + c)) / (a2 + b2);
  const y = (q * (b2 - a2) - 2 * a * (b * p + c)) / (a2 + b2);
  const absorption = wall.absorption.value >= 0 ? 1 - wall.absorption.value : dbToGain(wall.absorption.value);
  const gain = dbToGain(source.gain.value);

  return {
    ...source,
    x: { value: x, source: '' },
    y: { value: y, source: '' },
    angle: { value: -source.angle.value + 2 * wall.angle.value, source: '' },
    gain: { value: gainToDb(gain * absorption), source: '' },
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
      const angle = Math.atan2(sy + y0 - y / scale, sx + x0 - x / scale)
        + rad(source.angle.value)
        + (orientation === 'portrait' ? Math.PI : 0);

      yMap.set(y, {
        gain: dbToGain(source.gain.value) * models[source.model](adjustRotation(orientation, angle, true)) / Math.max(0.1, dist),
        delay: dist / $c,
      });
    }

    xMap.set(x, yMap);
  }

  arrivals.set(source, xMap);
  return xMap;
}

