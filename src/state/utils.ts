export function randomString(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return new Array(length)
    .fill(null)
    .map(() => chars.charAt(Math.floor(Math.random() * (chars.length + 1))))
    .join('');
}


export function safeDeepClone<T>(o: T): T {
  if (Array.isArray(o)) {
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
