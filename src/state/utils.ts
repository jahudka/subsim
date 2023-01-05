export function randomString(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return new Array(length)
    .fill(null)
    .map(() => chars.charAt(Math.floor(Math.random() * (chars.length + 1))))
    .join('');
}
