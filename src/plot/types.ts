import type { Line, Orientation, Source } from '../state';

export type GfxOptions = {
  orientation: Orientation;
  resolution: number;
  scale: number;
  w: number;
  h: number;
  x0: number;
  y0: number;
};

export type Elements = {
  sources: Source[];
  walls: Line[];
};

export type ArrivalPoint = {
  gain: number;
  delay: number;
};

export type Point = {
  gain: number;
  arrivals: ArrivalPoint[];
};

export type ArrivalMapY = Map<number, ArrivalPoint>;
export type ArrivalMapX = Map<number, ArrivalMapY>;
export type ArrivalMap = Map<Source, ArrivalMapX>;

export type ReflectionMap = Map<Source, Map<Line, Source>>;

export type GainMap = Map<number, Map<number, Point>>;
