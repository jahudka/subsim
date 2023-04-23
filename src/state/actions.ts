import {
  ExpressionProperty,
  Line,
  Rect,
  SimulationOptions,
  Source,
} from './types';

export type SetCanvasAction = {
  type: 'set-canvas';
  canvasType: 'ui' | 'plot' | 'context' | 'legend';
  canvas: HTMLCanvasElement;
};

export type SetCanvasSizeAction = {
  type: 'set-canvas-size';
  canvasType: 'plot' | 'context' | 'legend';
  width: number;
  height: number;
};

export type CreateProjectAction = {
  type: 'create-project';
};

export type SaveProjectAction = {
  type: 'save-project';
  name: string;
  copy?: boolean;
};

export type LoadProjectAction = {
  type: 'load-project';
  id: string;
};

export type ReloadProjectAction = {
  type: 'reload-project';
};

export type DeleteProjectAction = {
  type: 'delete-project';
  id: string;
};

export type SetViewAction = {
  type: 'set-view';
  x0: number;
  y0: number;
  scale: number;
};

export type ResetViewAction = {
  type: 'reset-view';
};

export type ShowContextAction = {
  type: 'show-context';
  x: number;
  y: number;
};

export type OptionName = string & keyof SimulationOptions;
export type OptionValue<O extends OptionName> = SimulationOptions[O];

export type SetOptionAction<O extends OptionName = any> = {
  type: 'set-opt';
  option: O;
  value: OptionValue<O>;
};

export type AddSourceAction = {
  type: 'add-src';
};

export type AddGuideAction = {
  type: 'add-guide';
  kind: 'rect' | 'line';
};

export type PropertyValue<O, P extends keyof O> = O[P] extends ExpressionProperty ? string : O[P];

export type SourceProperty = Exclude<keyof Source, symbol | 'id'>;

export type SetSourcePropertyAction<P extends SourceProperty = any> = {
  type: 'set-src';
  id: string;
  name: P;
  value: PropertyValue<Source, P>;
};

export type GuideProperty = Exclude<keyof Rect | keyof Line, symbol | 'id'>;

export type SetGuidePropertyAction<P extends GuideProperty = any> = {
  type: 'set-guide';
  id: string;
  name: P;
  value: PropertyValue<Rect & Line, P>;
};

export type DeleteSourceAction = {
  type: 'del-src';
  id: string;
};

export type DeleteGuideAction = {
  type: 'del-guide';
  id: string;
};

export type AddVariableAction = {
  type: 'add-var';
  name: string;
  min: number;
  max: number;
  value?: number;
  quick?: boolean;
  global?: boolean;
};

export type SetVariableAction = {
  type: 'set-var';
  name: string;
  value: number;
  global?: boolean;
};

export type DeleteVariableAction = {
  type: 'del-var';
  name: string;
  global?: boolean;
};

export type SetVariableQuickAction = {
  type: 'set-var-quick';
  name: string;
  quick: boolean;
};

export type Action =
  | SetCanvasAction
  | SetCanvasSizeAction
  | CreateProjectAction
  | SaveProjectAction
  | LoadProjectAction
  | ReloadProjectAction
  | DeleteProjectAction
  | SetViewAction
  | ResetViewAction
  | ShowContextAction
  | SetOptionAction
  | AddSourceAction
  | SetSourcePropertyAction
  | DeleteSourceAction
  | AddGuideAction
  | SetGuidePropertyAction
  | DeleteGuideAction
  | AddVariableAction
  | SetVariableAction
  | DeleteVariableAction
  | SetVariableQuickAction;



const proj = {
  create(): CreateProjectAction {
    return { type: 'create-project' };
  },
  save(name: string, copy?: boolean): SaveProjectAction {
    return { type: 'save-project', name, copy };
  },
  load(id: string): LoadProjectAction {
    return { type: 'load-project', id };
  },
  reload(): ReloadProjectAction {
    return { type: 'reload-project' };
  },
  del(id: string): DeleteProjectAction {
    return { type: 'delete-project', id };
  },
};

const canvas = {
  set(canvasType: 'plot' | 'ui' | 'context' | 'legend', canvas: HTMLCanvasElement): SetCanvasAction {
    return { type: 'set-canvas', canvasType, canvas };
  },
  setSize(canvasType: 'plot' | 'context' | 'legend', width: number, height: number): SetCanvasSizeAction {
    return { type: 'set-canvas-size', canvasType, width, height };
  },
};

const view = {
  set(x0: number, y0: number, scale: number): SetViewAction {
    return { type: 'set-view', x0, y0, scale };
  },
  reset(): ResetViewAction {
    return { type: 'reset-view' };
  },
};

const ctx = {
  show(x: number, y: number): ShowContextAction {
    return { type: 'show-context', x, y };
  },
};

const sim = {
  set<O extends OptionName>(option: O, value: OptionValue<O>): SetOptionAction<O> {
    return { type: 'set-opt', option, value };
  },
};

const src = {
  add(): AddSourceAction {
    return { type: 'add-src' };
  },
  set<P extends SourceProperty>(id: string, name: P, value: PropertyValue<Source, P>): SetSourcePropertyAction<P> {
    return { type: 'set-src', id, name, value };
  },
  del(id: string): DeleteSourceAction {
    return { type: 'del-src', id };
  },
};

const guide = {
  add(kind: 'rect' | 'line'): AddGuideAction {
    return { type: 'add-guide', kind };
  },
  set<P extends GuideProperty>(id: string, name: P, value: PropertyValue<Rect & Line, P>): SetGuidePropertyAction<P> {
    return { type: 'set-guide', id, name, value };
  },
  del(id: string): DeleteGuideAction {
    return { type: 'del-guide', id };
  },
};

const $var = {
  add(name: string, min: number, max: number, value?: number, quick?: boolean, global?: boolean): AddVariableAction {
    return { type: 'add-var', name, min, max, value, quick, global };
  },
  set(name: string, value: number, global?: boolean): SetVariableAction {
    return { type: 'set-var', name, value, global };
  },
  del(name: string, global?: boolean): DeleteVariableAction {
    return { type: 'del-var', name, global };
  },
  setQuick(name: string, quick: boolean): SetVariableQuickAction {
    return { type: 'set-var-quick', name, quick };
  },
};

export const $ = {
  proj,
  canvas,
  view,
  ctx,
  sim,
  src,
  guide,
  var: $var,
};

