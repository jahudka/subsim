import type { Line, Orientation, Source, SourceModel } from '../state';
import { rad } from '../utils';
import type {
  ArrivalMap,
  ArrivalMapX,
  ArrivalMapY,
  GainMap,
  GfxOptions,
  ReflectionMap,
} from './types';
import { adjustRotation, dbToGain, distance, gainToDb, swapAxes } from './utils';

type SimulationOptions = {
  frequency: number;
  $c: number;
};

const models: Record<string, SourceModel> = {
  omni: () => 1,
  cardioid: (a) => (1 - Math.cos(a)) / 2,
};

const reflectionMap: ReflectionMap = new Map();
const arrivalMap: ArrivalMap = new Map();
let sources: Source[] = [];
let gfx: GfxOptions | undefined = undefined;
let sim: SimulationOptions | undefined = undefined;

self.addEventListener('message', (evt) => {
  if (evt.data.action === 'set-options') {
    if (evt.data.gfx) {
      gfx = evt.data.gfx;
      reflectionMap.clear();
      arrivalMap.clear();
    }

    if (evt.data.elements) {
      sources = evt.data.elements.sources
        .filter((source: Source) => source.enabled)
        .flatMap((source: Source) => resolveReflections(source, evt.data.elements.walls));
    }

    if (!sim || evt.data.simulation.$c !== sim.$c) {
      arrivalMap.clear();
    }

    sim = evt.data.simulation;
    self.postMessage({ map: computeGainMap() });
  }
});

function computeGainMap(): GainMap | undefined {
  if (!gfx || !sim || !sources.length) {
    return undefined;
  }

  const { orientation, resolution, scale, w, h, x0, y0 } = gfx;
  const { frequency, $c } = sim;
  const map: GainMap = new Map();

  for (let x = resolution / 2; x <= w - resolution / 2; x += resolution) {
    const xmap: Map<number, number> = new Map();

    for (let y = resolution / 2; y <= h - resolution / 2; y += resolution) {
      // This amazing algorithm was derived from https://ccrma.stanford.edu/~jos/filters/Proof_Using_Trigonometry.html
      // 'ac' and 'as' are 'x' and 'y' - the sums of cosines and sines of each wave's phase multiplied by its gain
      const [ac, as] = sources.reduce(([ac, as], s) => {
        const b = getArrivals(s, orientation, resolution, scale, $c, w, h, x0, y0).get(x)!.get(y)!;
        const p = 2 * Math.PI * (frequency * (s.delay.value / 1000 + b.delay) + (s.invert ? 0.5 : 0));
        return [ac + b.gain * Math.cos(p), as + b.gain * Math.sin(p)];
      }, [0, 0]);

      xmap.set(y, gainToDb(Math.sqrt(ac ** 2 + as ** 2)));
    }

    map.set(x, xmap);
  }

  for (const source of arrivalMap.keys()) {
    if (!sources.includes(source)) {
      arrivalMap.delete(source);
    }
  }

  for (const source of reflectionMap.keys()) {
    if (!sources.includes(source)) {
      reflectionMap.delete(source);
    }
  }

  return map;
}

function resolveReflections(
  source: Source,
  walls: Line[],
): Source[] {
  reflectionMap.has(source) || reflectionMap.set(source, new Map());
  const reflections: Map<Line, Source> = reflectionMap.get(source)!;

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
  const absorption = wall.absorption.value >= 0 ? Math.sqrt(1 - wall.absorption.value) : dbToGain(wall.absorption.value);
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
  const existing = arrivalMap.get(source);

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

  arrivalMap.set(source, xMap);
  return xMap;
}
