import { ExpressionProperty, Line, Project, Rect, Source } from './types';

export type CreateProjectAction = {
  type: 'create-project';
};

export type SetProjectNameAction = {
  type: 'set-project-name';
  name: string;
};

export type SaveProjectAction = {
  type: 'save-project';
};

export type LoadProjectAction = {
  type: 'load-project';
  id: string;
};

export type DeleteProjectAction = {
  type: 'delete-project';
  id: string;
};

export type OptionKind = 'area' | 'simulation';
export type OptionName<K extends OptionKind> = Exclude<keyof Project[K], symbol>;
export type OptionValue<K extends OptionKind, O extends OptionName<K>> = Project[K][O];

export type SetOptionAction<K extends OptionKind = any, O extends OptionName<K> = any> = {
  type: 'set-opt';
  kind: K;
  option: O;
  value: OptionValue<K, O>;
};

export type AddSourceAction = {
  type: 'add-src';
};

export type AddGuideAction = {
  type: 'add-guide';
  kind: 'rect' | 'line';
};

export type PropertyValue<O, P extends keyof O> = O[P] extends ExpressionProperty ? string : O[P];

export type SourceProperty = Exclude<keyof Source, symbol>;

export type SetSourcePropertyAction<P extends SourceProperty = any> = {
  type: 'set-src';
  id: number;
  name: P;
  value: PropertyValue<Source, P>;
};

export type GuideProperty = Exclude<keyof Rect | keyof Line, symbol>;

export type SetGuidePropertyAction<P extends GuideProperty = any> = {
  type: 'set-guide';
  id: number;
  name: P;
  value: PropertyValue<Rect & Line, P>;
};

export type DeleteSourceAction = {
  type: 'del-src';
  id: number;
};

export type DeleteGuideAction = {
  type: 'del-guide';
  id: number;
};

export type AddVariableAction = {
  type: 'add-var';
  name: string;
  min: number;
  max: number;
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

export type Action =
  | CreateProjectAction
  | SetProjectNameAction
  | SaveProjectAction
  | LoadProjectAction
  | DeleteProjectAction
  | SetOptionAction
  | AddSourceAction
  | AddGuideAction
  | SetSourcePropertyAction
  | SetGuidePropertyAction
  | DeleteSourceAction
  | DeleteGuideAction
  | AddVariableAction
  | SetVariableAction
  | DeleteVariableAction;

export const proj = {
  create(): CreateProjectAction {
    return { type: 'create-project' };
  },
  setName(name: string): SetProjectNameAction {
    return { type: 'set-project-name', name };
  },
  save(): SaveProjectAction {
    return { type: 'save-project' };
  },
  load(id: string): LoadProjectAction {
    return { type: 'load-project', id };
  },
  del(id: string): DeleteProjectAction {
    return { type: 'delete-project', id };
  },
};

export const set = {
  opt<K extends OptionKind, O extends OptionName<K>>(kind: K, option: O, value: OptionValue<K, O>): SetOptionAction<K, O> {
    return { type: 'set-opt', kind, option, value };
  },
  src<P extends SourceProperty>(id: number, name: P, value: PropertyValue<Source, P>): SetSourcePropertyAction<P> {
    return { type: 'set-src', id, name, value };
  },
  guide<P extends GuideProperty>(id: number, name: P, value: PropertyValue<Rect & Line, P>): SetGuidePropertyAction<P> {
    return { type: 'set-guide', id, name, value };
  },
  var(name: string, value: number, global?: boolean): SetVariableAction {
    return { type: 'set-var', name, value, global };
  },
};

export const add = {
  src(): AddSourceAction {
    return { type: 'add-src' };
  },
  guide(kind: 'rect' | 'line'): AddGuideAction {
    return { type: 'add-guide', kind };
  },
  var(name: string, min: number, max: number): AddVariableAction {
    return { type: 'add-var', name, min, max };
  },
};

export const del = {
  src(id: number): DeleteSourceAction {
    return { type: 'del-src', id };
  },
  guide(id: number): DeleteGuideAction {
    return { type: 'del-guide', id };
  },
  var(name: string, global?: boolean): DeleteVariableAction {
    return { type: 'del-var', name, global };
  },
};
