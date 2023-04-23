import { LocalEngine, ProxyEngine } from '../engine';
import { Context, extractVariables, GlobalContext, Literal, Parser } from '../expressions';
import { $expr, $vars } from '../utils';
import {
  Action,
  GuideProperty,
  PropertyValue,
  SourceProperty,
} from './actions';
import { ProjectManager } from './manager';
import {
  ExpressionProperty,
  Line,
  Project,
  ProjectState,
  Rect,
  SimulationOptions,
  Source,
} from './types';
import { getDefaultProjectView, randomKey } from './utils';

const parser = new Parser();
const globals = new GlobalContext();
const ctx = new Context(globals);
const manager = new ProjectManager(parser);

export const engine = ProxyEngine.isSupported()
  ? new ProxyEngine()
  : new LocalEngine();

globals.variables.set('$c', 343);
globals.functions.set('qw', function qw(freq: number) { return 0.25 * this.get('$c') / freq; });
globals.functions.set('qt', function qt(freq: number) { return 250 / freq; });
globals.functions.set('dt', function dt(dist: number) { return 1000 * dist / this.get('$c'); });

export function dispatchAction(state: ProjectState, action: Action): ProjectState {
  switch (action.type) {
    case 'set-canvas':
      engine.setCanvas(action.canvasType, action.canvas);
      return state;
    case 'set-canvas-size':
      engine.setCanvasSize(action.canvasType, action.width, action.height);
      return state;
    case 'create-project': return createProject();
    case 'save-project': return saveProject(state, action.name, action.copy);
    case 'load-project': return loadProject(action.id);
    case 'reload-project': return loadProject(state.id);
    case 'delete-project': return deleteProject(state, action.id);
    case 'set-view': return setView(state, action.x0, action.y0, action.scale);
    case 'reset-view': return resetView(state);
    case 'show-context':
      engine.renderContext(action.x, action.y);
      return state;
    case 'set-opt': return setOption(state, action.option, action.value);
    case 'add-src': return addSource(state);
    case 'set-src': return setSourceProp(state, action.id, action.name, action.value);
    case 'del-src': return deleteSource(state, action.id);
    case 'add-guide': return addGuide(state, action.kind);
    case 'set-guide': return setGuideProp(state, action.id, action.name, action.value);
    case 'del-guide': return deleteGuide(state, action.id);
    case 'add-var': return addVar(state, action.name, action.min, action.max, action.value, action.quick, action.global);
    case 'set-var': return setVar(state, action.name, action.value, action.global);
    case 'del-var': return delVar(state, action.name, action.global);
    case 'set-var-quick': return setVarQuick(state, action.name, action.quick);
  }
}

export function getProjectList(): Project[] {
  return manager.getList();
}

export function loadLastProject(): ProjectState {
  return initProject(manager.loadLast());
}



function createProject(): ProjectState {
  return initProject(manager.create());
}

function saveProject(state: ProjectState, name: string, copy?: boolean): ProjectState {
  if (!copy && (state.example || (!state.modified && name === state.name))) {
    return state;
  }

  state.name = name;
  copy && (state.created = new Date());
  state.lastModified = new Date();
  const { example, modified, view, ...project } = state;
  manager.save(project, copy);
  return { view, ...project };
}

function loadProject(id: string): ProjectState {
  return initProject(manager.load(id));
}

function initProject(project: Project): ProjectState {
  for (const [key, store] of [['globals', globals.variables], ['variables', ctx.variables]] as const) {
    store.clear();

    for (const [variable, { value }] of Object.entries(project[key])) {
      store.set(variable, value);
    }
  }

  engine.clearAll();

  for (const source of project.sources) {
    engine.mergeSource(source);
  }

  for (const guide of project.guides) {
    engine.mergeGuide(guide);
  }

  engine.setOptions(project.simulation, globals.get('$c'));

  const view = getDefaultProjectView(project);
  engine.setView(view);

  return { ...project, view };
}

function deleteProject(state: ProjectState, id: string): ProjectState {
  manager.delete(id);
  return { ...state };
}

function setView(state: ProjectState, x0: number, y0: number, scale: number): ProjectState {
  const view = { x0, y0, scale };
  engine.setView(view);
  return { ...state, view };
}

function resetView(state: ProjectState): ProjectState {
  const view = getDefaultProjectView(state);
  engine.setView(view);
  return { ...state, view };
}

function setOption<O extends keyof SimulationOptions>(
  state: ProjectState,
  option: O,
  value: SimulationOptions[O],
): ProjectState {
  state.simulation = { ...state.simulation, [option]: value };
  engine.setOptions(state.simulation, globals.get('$c'));
  return { ...state, modified: true };
}

function addSource(state: ProjectState): ProjectState {
  const id = randomKey(state.sources);
  const source: Source = {
    id,
    x: expr(0),
    y: expr(0),
    angle: expr(0),
    width: expr(1),
    depth: expr(0.6),
    delay: expr(0),
    gain: expr(0),
    invert: false,
    model: 'omni',
    enabled: true,
  };

  state.sources = [...state.sources, source];
  engine.mergeSource(source);
  return { ...state, modified: true };
}

function addGuide(state: ProjectState, kind: 'rect' | 'line'): ProjectState {
  const common = {
    id: randomKey(state.guides),
    angle: expr(0),
    color: '#000',
  };

  const guide = kind === 'rect'
    ? { ...common, kind, x: expr(0), y: expr(-3), width: expr(10), height: expr(6) }
    : { ...common, kind, x: expr(-10), y: expr(0), reflect: false, absorption: expr(0) };

  state.guides = [...state.guides, guide];
  engine.mergeGuide(guide);
  return { ...state, modified: true };
}

function setSourceProp<P extends SourceProperty>(
  state: ProjectState,
  id: string,
  name: P,
  value: PropertyValue<Source, P>,
): ProjectState {
  const [sources, source] = patch(state.sources, id, name, value);

  if (source) {
    state.sources = sources;
    engine.mergeSource(source);
    return { ...state, modified: true };
  } else {
    return state;
  }
}


function setGuideProp<P extends GuideProperty>(
  state: ProjectState,
  id: string,
  name: P,
  value: PropertyValue<Rect & Line, P>,
): ProjectState {
  const [guides, guide] = patch(state.guides, id, name, value);

  if (guide) {
    state.guides = guides;
    engine.mergeGuide(guide);
    return { ...state, modified: true };
  } else {
    return state;
  }
}

function deleteSource(state: ProjectState, id: string): ProjectState {
  state.sources = state.sources.filter((source) => source.id !== id);
  engine.deleteSource(id);
  return { ...state, modified: true };
}

function deleteGuide(state: ProjectState, id: string): ProjectState {
  state.guides = state.guides.filter((guide) => {
    if (guide.id !== id) {
      return true;
    }

    engine.deleteGuide(id);
    return false;
  });

  return { ...state, modified: true };
}


function addVar(state: ProjectState, name: string, min: number, max: number, value?: number, quick: boolean = true, global?: boolean): ProjectState {
  const [key, map] = global ? ['globals', globals.variables] : ['variables', ctx.variables];
  value ??= (min + max) / 2;
  const local = global ? {} : { quick };
  state[key] = { ...state[key], [name]: { min, max, value, ...local } };
  map.set(name, value);
  return checkDependencies(state, name);
}

function setVar(state: ProjectState, name: string, value: number, global?: boolean): ProjectState {
  const [key, map] = global ? ['globals', globals.variables] : ['variables', ctx.variables];
  const { min, max, ...rest } = state[key][name];
  value = Math.max(min, Math.min(max, value));
  state[key] = { ...state[key], [name]: { min, max, ...rest, value } };
  map.set(name, value);
  return checkDependencies(state, name);
}

function delVar(state: ProjectState, name: string, global?: boolean): ProjectState {
  const [key, map] = global ? ['globals', globals.variables] : ['variables', ctx.variables];
  const { [name]: _, ...others } = state[key];
  state[key] = others;
  map.delete(name);
  return checkDependencies(state, name);
}

function setVarQuick(state: ProjectState, name: string, quick: boolean): ProjectState {
  return {
    ...state,
    variables: {
      ...state.variables,
      [name]: { ...state.variables[name], quick },
    },
  };
}


function expr(value: number): ExpressionProperty {
  return {
    source: value.toString(),
    value,
    [$expr]: new Literal(0, value),
    [$vars]: [],
  };
}

function patch<O extends { id: string }>(items: O[], id: string, k: any, v: any): [O[], O | undefined] {
  let patched: O | undefined;

  items = items.map((item) => {
    if (patched || item.id !== id) {
      return item;
    }

    return patched = {
      ...item,
      [k]: typeof v === 'string' && typeof item[k] === 'object' ? toExpr(v) : v,
    };
  });

  return [items, patched];
}

function toExpr(source: string): ExpressionProperty {
  const property: ExpressionProperty = {
    source,
    value: 0,
  };

  try {
    property[$expr] = parser.parse(source);
    property[$vars] = extractVariables(property[$expr]);
  } catch (e) {
    property.error = e.message;
  }

  solve(property);
  return property;
}

function solve(property: ExpressionProperty): boolean {
  if (!property[$expr]) {
    return false;
  }

  try {
    const value = property[$expr].evaluate(ctx);

    if (value !== property.value) {
      property.value = value;
      property.error = undefined;
      return true;
    }
  } catch (e) {
    property.error = e.message;
    return true;
  }

  return false;
}

function checkDependencies(project: ProjectState, variable: string): ProjectState {
  let ch1 = false, ch2 = false;

  const sources = project.sources.map((src) => {
    let ch = false;

    for (const prop of ['x', 'y', 'angle', 'width', 'depth', 'delay', 'gain']) {
      if (src[prop][$vars].includes(variable) && solve(src[prop])) {
        ch1 = ch = true;
      }
    }

    ch && engine.mergeSource(src);
    return ch ? { ...src } : src;
  });

  ch1 && (project.sources = sources);

  const guides = project.guides.map((guide) => {
    let ch = false;

    for (const prop of ['x', 'y', 'angle', 'width', 'height', 'absorption']) {
      if (guide[prop] && guide[prop][$vars].includes(variable) && solve(guide[prop])) {
        ch2 = ch = true;
      }
    }

    ch && engine.mergeGuide(guide);
    return ch ? { ...guide } : guide;
  });

  ch2 && (project.guides = guides);
  return { ...project, modified: true };
}
