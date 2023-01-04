import { Expression } from '../expressions';

export const $id = Symbol('$id');

export type ExpressionProperty = {
  source: string;
  value: number;
  expression?: Expression;
  variables?: string[];
  error?: string;
};

export type Orientation = 'portrait' | 'landscape';

export type AreaConfig = {
  scale: number;
  width: number;
  depth: number;
  x0: number;
  y0: number;
  orientation: Orientation;
};

export type SimulationOptions = {
  frequency: number;
  resolution: number;
};

export type SourceModel = {
  (angle: number): number;
};

export const omni: SourceModel = () => 1;
export const cardioid: SourceModel = (a) => (1 - Math.cos(a)) / 2;

export type Source = {
  [$id]: number;
  x: ExpressionProperty;
  y: ExpressionProperty;
  angle: ExpressionProperty;
  width: ExpressionProperty;
  depth: ExpressionProperty;
  delay: ExpressionProperty;
  gain: ExpressionProperty;
  invert: boolean;
  model: SourceModel;
  enabled: boolean;
};

export type Rect = {
  [$id]: number;
  kind: 'rect';
  x: ExpressionProperty;
  y: ExpressionProperty;
  angle: ExpressionProperty;
  width: ExpressionProperty;
  height: ExpressionProperty;
  color: string;
  label?: string;
};

export type Line = {
  [$id]: number;
  kind: 'line';
  x: ExpressionProperty;
  y: ExpressionProperty;
  angle: ExpressionProperty;
  reflect: boolean;
  color: string;
  label?: string;
};

export type Guide = Rect | Line;

export type Variable = {
  min: number;
  max: number;
  value: number;
};

export type VariableMap = Record<string, Variable>;

export type Project = {
  // name: string;
  area: AreaConfig;
  simulation: SimulationOptions;
  sources: Source[];
  guides: Guide[];
  variables: VariableMap;
  globals: VariableMap;
};
