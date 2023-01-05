import { Project } from '../types';
import examples from '../examples.json';
import { randomString } from '../utils';

function genId(projects: Project[]): string {
  while (true) {
    const id = randomString();

    if (!projects.find((p) => p.id === id)) {
      return id;
    }
  }
}

/**
 * 1. discard example projects which might've been stored in early version
 * 2. add project id if missing
 * 3. add absorption coefficient to line guides if missing
 */
export function migration001(projects: Project[]): Project[] {
  const withoutExamples = projects.filter((p) => !examples.find((e) => e.name === p.name));

  return withoutExamples.map((p) => {
    p.id || (p.id = genId(withoutExamples));

    for (const guide of p.guides) {
      if (guide.kind === 'line' && !guide.absorption) {
        guide.absorption = { source: '0', value: 0 };
      }
    }

    return p;
  });
}
