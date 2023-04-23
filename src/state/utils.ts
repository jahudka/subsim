import { rad } from '../utils';
import { ExpressionProperty, Project, ViewState } from './types';

type Id = { id: string };

export function randomKey(list: Id[], length: number = 8): string {
  let id: string;

  do {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    id = new Array(length)
      .fill(null)
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join('');
  } while (list.find((item) => item.id === id));

  return id;
}


type Range = { min: number, max: number };

function updateRange(range: Partial<Range>, value: number): void {
  range.min = range.min === undefined ? value : Math.min(range.min, value);
  range.max = range.max === undefined ? value : Math.max(range.max, value);
}

function * getCorners(
  x: ExpressionProperty,
  y: ExpressionProperty,
  angle: ExpressionProperty,
  width: ExpressionProperty,
  height: ExpressionProperty,
): Iterable<{ x: number, y: number }> {
  const a = Math.atan2(height.value, width.value);
  const r = Math.sqrt(height.value ** 2 + width.value ** 2) / 2;

  for (let c = 0; c < 2; c += 0.5) {
    const sin = Math.sin(Math.PI * c + a + rad(angle.value));
    const cos = Math.cos(Math.PI * c + a + rad(angle.value));
    yield { x: x.value + cos * r, y: y.value + sin * r };
  }
}

function completeRange(range: Partial<Range>): asserts range is Range {
  range.min ??= 0;
  range.max ??= 0;
}

function getProjectBoundaries(project: Project): { x: Range, y: Range } {
  const x: Partial<Range> = {};
  const y: Partial<Range> = {};
  const s: ExpressionProperty = { value: 30, source: '' };

  for (const source of project.sources.values()) {
    for (const corner of getCorners(source.x, source.y, source.angle, s, s)) {
      updateRange(x, corner.x);
      updateRange(y, corner.y);
    }
  }

  for (const guide of project.guides.values()) {
    if (guide.kind === 'rect') {
      for (const corner of getCorners(guide.x, guide.y, guide.angle, guide.width, guide.height)) {
        updateRange(x, corner.x);
        updateRange(y, corner.y);
      }
    }
  }

  completeRange(x);
  completeRange(y);

  const cx = (x.min + x.max) / 2;
  const cy = (y.min + y.max) / 2;

  for (const guide of project.guides.values()) {
    if (guide.kind === 'line') {
      const cos = Math.cos(rad(guide.angle.value));
      const sin = Math.sin(rad(guide.angle.value));
      updateRange(x, Math.abs(cos) > 0.000000001 ? cx + (guide.x.value - cx) / cos : guide.x.value);
      updateRange(y, Math.abs(sin) > 0.000000001 ? cy + (guide.y.value - cy) / sin : guide.y.value);
    }
  }

  return { x, y };
}

export function getDefaultProjectView(project: Project): ViewState {
  const boundaries = getProjectBoundaries(project);
  boundaries.x.min *= 1.25;
  boundaries.x.max *= 1.25;
  boundaries.y.min *= 1.25;
  boundaries.y.max *= 1.25;

  const viewportSize = Math.min(window.innerWidth, window.innerHeight);
  const contentWidth = boundaries.x.max - boundaries.x.min;
  const contentHeight = boundaries.y.max - boundaries.y.min;
  const contentSize = Math.max(contentWidth, contentHeight, 50);
  const scale = viewportSize / contentSize;
  const x0 = boundaries.x.min - (window.innerWidth - contentWidth * scale) / (2 * scale);
  const y0 = boundaries.y.min - (window.innerHeight - contentHeight * scale) / (2 * scale);
  return { scale, x0, y0 };
}
