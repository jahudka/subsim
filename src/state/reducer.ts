import { Context, extractVariables, GlobalContext, Literal, Parser } from '../expressions';
import { Action, GuideProperty, PropertyValue, SetOptionAction, SourceProperty } from './actions';
import { $id, ExpressionProperty, Line, omni, Project, Rect, Source } from './types';

const parser = new Parser();
const globals = new GlobalContext();
const ctx = new Context(globals);
let gid = 0;

function genId(): number {
  if (++gid >= Number.MAX_SAFE_INTEGER) {
    gid = 0;
  }

  return gid;
}

globals.variables.set('$c', 343);
globals.functions.set('qw', function qw(freq: number) { return 0.25 * this.get('$c') / freq; });
globals.functions.set('qt', function qt(freq: number) { return 250 / freq; });
globals.functions.set('dt', function dt(dist: number) { return 1000 * dist / this.get('$c'); });

export function dispatchAction(project: Project, action: Action): Project {
  switch (action.type) {
    case 'set-opt': return setOption(project, action);
    case 'add-src': return addSource(project);
    case 'add-guide': return addGuide(project, action.kind);
    case 'set-src': return setSourceProp(project, action.id, action.name, action.value);
    case 'set-guide': return setGuideProp(project, action.id, action.name, action.value);
    case 'del-src': return deleteSource(project, action.id);
    case 'del-guide': return deleteGuide(project, action.id);
    case 'add-var': return addVar(project, action.name, action.min, action.max, action.global);
    case 'set-var': return setVar(project, action.name, action.value, action.global);
    case 'del-var': return delVar(project, action.name, action.global);
  }
}

function setOption(project: Project, action: SetOptionAction): Project {
  project[action.kind][action.option] = action.value;
  project[action.kind] = { ...project[action.kind] } as any;
  return { ...project };
}

function addSource(project: Project): Project {
  project.sources = project.sources.concat({
    [$id]: genId(),
    x: expr(0),
    y: expr(0),
    angle: expr(0),
    width: expr(1),
    depth: expr(0.6),
    delay: expr(0),
    gain: expr(0),
    invert: false,
    model: omni,
    enabled: true,
  });

  return { ...project };
}

function addGuide(project: Project, kind: 'rect' | 'line'): Project {
  const common = {
    [$id]: genId(),
    x: expr(0),
    y: expr(-3),
    angle: expr(0),
    color: '#000',
  };

  project.guides = project.guides.concat(
    kind === 'rect'
      ? { ...common, kind, width: expr(10), height: expr(6) }
      : { ...common, kind, reflect: false }
  );

  return { ...project };
}

function setSourceProp<P extends SourceProperty>(project: Project, id: number, name: P, value: PropertyValue<Source, P>): Project {
  project.sources = project.sources.map((src) => patch(src, id, name, value));
  return { ...project };
}

function setGuideProp<P extends GuideProperty>(project: Project, id: number, name: P, value: PropertyValue<Rect & Line, P>): Project {
  project.guides = project.guides.map((g) => patch(g, id, name, value));
  return { ...project };
}

function deleteSource(project: Project, id: number): Project {
  project.sources = project.sources.filter((src) => src[$id] !== id);
  return { ...project };
}

function deleteGuide(project: Project, id: number): Project {
  project.guides = project.guides.filter((src) => src[$id] !== id);
  return { ...project };
}

function addVar(project: Project, name: string, min: number, max: number, global?: boolean): Project {
  const [key, map] = global ? ['globals', globals.variables] : ['variables', ctx.variables];
  const value = (min + max) / 2;
  project[key] = { ...project[key], [name]: { min, max, value } };
  map.set(name, value);
  return checkDependencies(project, name);
}

function setVar(project: Project, name: string, value: number, global?: boolean): Project {
  const [key, map] = global ? ['globals', globals.variables] : ['variables', ctx.variables];
  const { min, max } = project[key][name];
  value = Math.max(min, Math.min(max, value));
  project[key] = { ...project[key], [name]: { min, max, value } };
  map.set(name, value);
  return checkDependencies(project, name);
}

function delVar(project: Project, name: string, global?: boolean): Project {
  const [key, map] = global ? ['globals', globals.variables] : ['variables', ctx.variables];
  const { [name]: _, ...others } = project[key];
  project[key] = others;
  map.delete(name);
  return checkDependencies(project, name);
}



function expr(value: number): ExpressionProperty {
  return {
    source: value.toString(),
    value,
    expression: new Literal(0, value),
    variables: [],
  };
}

function patch<O extends { [$id]: number }>(o: O, id: number, k: any, v: any): O {
  if (o[$id] !== id) return o;
  o[k] = typeof v === 'string' && typeof o[k] === 'object' ? toExpr(v) : v;
  return { ...o };
}

function toExpr(source: string): ExpressionProperty {
  const property: ExpressionProperty = {
    source,
    value: 0,
  };

  try {
    property.expression = parser.parse(source);
    property.variables = extractVariables(property.expression);
  } catch (e) {
    property.error = e.message;
  }

  solve(property);
  return property;
}

function solve(property: ExpressionProperty): boolean {
  if (!property.expression) {
    return false;
  }

  try {
    const value = property.expression.evaluate(ctx);

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

function checkDependencies(project: Project, variable: string): Project {
  let ch1 = false, ch2 = false;

  const sources = project.sources.map((src) => {
    let ch = false;

    for (const prop of ['x', 'y', 'angle', 'width', 'depth', 'delay', 'gain']) {
      if (src[prop].variables.includes(variable) && solve(src[prop])) {
        ch1 = ch = true;
      }
    }

    return ch ? { ...src } : src;
  });

  ch1 && (project.sources = sources);

  const guides = project.guides.map((src) => {
    let ch = false;

    for (const prop of ['x', 'y', 'angle', 'width', 'height']) {
      if (src[prop] && src[prop].variables.includes(variable) && solve(src[prop])) {
        ch2 = ch = true;
      }
    }

    return ch ? { ...src } : src;
  });

  ch2 && (project.guides = guides);
  return { ...project };
}
