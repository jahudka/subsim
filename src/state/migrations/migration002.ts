import { RawProject } from '../types';

export function migration002(projects: RawProject[]): RawProject[] {
  return projects.map((project) => {
    project.simulation.gain ??= 0;
    return project;
  });
}
