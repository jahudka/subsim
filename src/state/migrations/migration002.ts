import { Project } from '../types';

export function migration002(projects: Project[]): Project[] {
  return projects.map((project) => {
    project.simulation.gain ??= 0;
    return project;
  });
}
