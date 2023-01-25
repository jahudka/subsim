import type { Expression } from '../expressions';
import { $expr, $id, $vars } from '../utils';

export type ExpressionProperty = {
  source: string;
  value: number;
  [$expr]?: Expression;
  [$vars]?: string[];
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
  model: string;
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
  absorption: ExpressionProperty;
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
  id: string;
  name: string;
  created: Date,
  lastModified: Date,
  area: AreaConfig;
  simulation: SimulationOptions;
  sources: Source[];
  guides: Guide[];
  variables: VariableMap;
  globals: VariableMap;
};

export type ProjectInfo = {
  id: string;
  name: string;
  created: Date;
  lastModified: Date;
};
