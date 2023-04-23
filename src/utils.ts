export const $expr = Symbol('$expr');
export const $vars = Symbol('$vars');

export function deg(value: number): number {
  return 180 * value / Math.PI;
}

export function rad(value: number): number {
  return Math.PI * value / 180;
}

export function distance(ax: number, ay: number, bx: number, by: number): number {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

export function dbToGain(db: number): number {
  return 10 ** (db / 20);
}

export function gainToDb(gain: number): number {
  return 20 * Math.log10(gain);
}

export function safeDeepClone<T>(o: T): T {
  if (o instanceof Map) {
    return new Map([...o].map(([k, v]) => [k, safeDeepClone(v)])) as T;
  } else if (Array.isArray(o)) {
    return o.map(safeDeepClone) as T;
  } else if (isPlainObject(o)) {
    const r: any = {};

    for (const p of Reflect.ownKeys(o as any)) {
      r[p] = safeDeepClone(o[p]);
    }

    return r;
  } else {
    return o;
  }
}

function isPlainObject(o: any): boolean {
  return o !== null && typeof o === 'object' && (o.constructor === undefined || o.constructor === Object);
}
