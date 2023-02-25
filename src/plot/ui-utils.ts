import { RefObject, useRef } from 'react';
import { AreaConfig, SimulationOptions, useArea, useSimulation } from '../state';
import { swapAxes } from './utils';

export type UiPrimitives = Omit<AreaConfig, 'depth'> & SimulationOptions & {
  ref: RefObject<HTMLCanvasElement>;
  height: number;
  w: number;
  h: number;
};

export function useUiPrimitives(): UiPrimitives {
  const { orientation, scale, width: aw, depth: ad, x0: ax0, y0: ay0 } = useArea();
  const { resolution, frequency, gain } = useSimulation();
  const ref = useRef<HTMLCanvasElement>(null);

  const [width, height] = swapAxes(orientation, aw, ad);
  const [x0, y0] = swapAxes(orientation, ax0, ay0);

  const [w, h] = swapAxes(
    orientation,
    resolution * Math.floor(aw * scale / resolution),
    resolution * Math.floor(ad * scale / resolution),
  );

  return {
    orientation,
    resolution,
    frequency,
    gain,
    scale,
    width,
    height,
    x0,
    y0,
    w,
    h,
    ref,
  };
}
