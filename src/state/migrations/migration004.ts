import { RawProject } from '../types';

export function migration004(projects: RawProject[]): RawProject[] {
  return projects.map((project) => {
    for (const source of project.sources) {
      source.kind ??= 'source';
    }

    for (const variable of [...Object.values(project.variables), ...Object.values(project.globals)]) {
      variable.step ??= 0;
    }

    return project;
  });
}
