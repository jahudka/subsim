import { RawProject } from '../types';
import { randomKey } from '../utils';

export function migration003(projects: RawProject[]): RawProject[] {
  return projects.map((project) => {
    'area' in project && delete project.area;
    'resolution' in project.simulation && delete project.simulation.resolution;
    project.simulation.range ??= 54;

    for (const source of project.sources) {
      source.id ??= randomKey(project.sources);
    }

    for (const guide of project.guides) {
      guide.id ??= randomKey(project.guides);
      guide.color = guide.color.replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3');
    }

    for (const variable of Object.values(project.variables)) {
      variable.quick ??= true;
    }

    return project;
  });
}
