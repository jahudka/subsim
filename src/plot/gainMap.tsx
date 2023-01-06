import {
  createContext,
  FC,
  MutableRefObject,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { useDerivedState } from '../hooks';
import { Guide, Line, useGlobals, useGuides, useSources } from '../state';
import { Children } from '../types';
import { Elements, GainMap, GfxOptions } from './types';
import { useUiPrimitives } from './ui-utils';

const Ctx = createContext<GainMap | undefined>(undefined);

export function useGainMap(): GainMap | undefined {
  return useContext(Ctx);
}

function isReflectingLine(guide: Guide): guide is Line {
  return guide.kind === 'line' && guide.reflect;
}

const worker = new Worker(
  new URL('./gainMapWorker.ts', import.meta.url),
  { type: 'module' }
);

function getInitialState(...dependencies: any[]): GainMap | undefined {
  return undefined;
}

function getIfNotSameAsCached<T extends object>(ref: MutableRefObject<T | undefined>, current: T): T | undefined {
  if (!ref.current) {
    return ref.current = current;
  }

  for (const key of Object.keys(current)) {
    if (current[key] !== ref.current[key]) {
      return ref.current = current;
    }
  }

  return undefined;
}

export const GainMapProvider: FC<Children> = ({ children }) => {
  const { orientation, resolution, frequency, scale, x0, y0, w, h } = useUiPrimitives();
  const { $c: { value: $c } } = useGlobals();
  const guides = useGuides();
  const walls = useMemo(() => guides.filter(isReflectingLine), [guides]);
  const sources = useSources();
  const $gfx = useRef<GfxOptions>();
  const $elms = useRef<Elements>();
  const gfx = getIfNotSameAsCached($gfx, { orientation, resolution, scale, w, h, x0, y0 });
  const elements = getIfNotSameAsCached($elms, { sources, walls });
  const [map, setMap] = useDerivedState(getInitialState, gfx);

  useLayoutEffect(() => {
    worker.postMessage({
      action: 'set-options',
      simulation: { frequency, $c },
      gfx,
      elements,
    });
  }, [gfx, elements, frequency, $c]);

  useLayoutEffect(() => {
    const handleMessage = (evt: MessageEvent) => {
      if (evt.data.map) {
        setMap(evt.data.map);
      }
    };

    worker.addEventListener('message', handleMessage);
    return () => worker.removeEventListener('message', handleMessage);
  }, []);

  return (
    <Ctx.Provider value={map}>{children}</Ctx.Provider>
  );
};

