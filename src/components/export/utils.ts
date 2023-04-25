export function sanitizeFileName(name: string): string {
  return name
    .replace(/[^-\w._ ]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
