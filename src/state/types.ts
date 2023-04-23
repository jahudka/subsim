import type { Expression } from '../expressions';
import { $expr, $vars } from '../utils';

export type ExpressionProperty = {
  source: string;
  value: number;
  [$expr]?: Expression;
  [$vars]?: string[];
  error?: string;
};

export type ViewState = {
  scale: number;
  x0: number;
  y0: number;
};

export type SimulationOptions = {
  frequency: number;
  gain: number;
  range: number;
  step?: number;
};

export type SourceModel = {
  (angle: number): number;
};

export type Source = {
  id: string;
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
  id: string;
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
  id: string;
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

export type LocalVariable = Variable & {
  quick: boolean;
};

export type VariableMap = Record<string, Variable>;
export type LocalVariableMap = Record<string, LocalVariable>;

export type ProjectMeta = {
  id: string;
  name: string;
  created: Date;
  lastModified: Date;
  example?: boolean;
};

export type ProjectData = {
  simulation: SimulationOptions;
  sources: Source[];
  guides: Guide[];
  variables: LocalVariableMap;
  globals: VariableMap;
};

export type Project = ProjectMeta & ProjectData;

export type RawProjectMeta = {
  id: string;
  name: string;
  created: string;
  lastModified: string;
  example?: boolean;
}

export type RawProject = RawProjectMeta & ProjectData;

export type ProjectInfo = ProjectMeta & {
  modified?: boolean;
};

export type ProjectState = Project & {
  modified?: boolean;
  view: ViewState;
};
