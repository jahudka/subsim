import { RawProject } from '../types';
import examples from '../examples.json';
import { randomKey } from '../utils';


/**
 * 1. discard example projects which might've been stored in early version
 * 2. add project id if missing
 * 3. add absorption coefficient to line guides if missing
 */
export function migration001(projects: RawProject[]): RawProject[] {
  const withoutExamples = projects.filter(isNotExample);

  return withoutExamples.map((p) => {
    p.id ??= randomKey(withoutExamples);

    for (const guide of p.guides) {
      if (guide.kind === 'line' && !guide.absorption) {
        guide.absorption = { source: '0', value: 0 };
      }
    }

    return p;
  });
}

function isNotExample(project: RawProject): boolean {
  return project.id !== undefined
    ? !/^examples\//.test(project.id)
    : !examples.find((e) => e.name === project.name);
}
