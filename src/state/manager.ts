import { extractVariables, Parser } from '../expressions';
import { $expr, $vars, safeDeepClone } from '../utils';
import examples from './examples.json';
import { migrate } from './migrations';
import { ExpressionProperty, Project, RawProject } from './types';
import { randomKey } from './utils';

export class ProjectManager {
  private readonly parser: Parser;
  private readonly projects: Project[];

  constructor(parser: Parser) {
    this.parser = parser;
    this.projects = this.readStorage();
  }

  getList(): Project[] {
    return this.projects;
  }

  loadLast(): Project {
    for (const project of this.getList()) {
      return this.hydrateData(safeDeepClone(project));
    }

    return this.create();
  }

  load(id: string): Project {
    return this.hydrateData(safeDeepClone(this.projects.find((p) => p.id === id)!));
  }

  save(project: Project, copy?: boolean): void {
    if (copy) {
      project.id = randomKey(this.projects);
    } else {
      const idx = this.projects.findIndex((p) => p.id === project.id);
      idx >= 0 && this.projects.splice(idx, 1);
    }

    this.projects.unshift(project);
    this.writeStorage();
  }

  delete(id: string): void {
    const idx = this.projects.findIndex((p) => p.id === id);

    if (idx >= 0) {
      this.projects.splice(idx, 1);
      this.writeStorage();
    }
  }

  create(): Project {
    const created = new Date();
    const project: Project = {
      id: randomKey(this.projects),
      name: 'new project',
      created,
      lastModified: created,
      simulation: {
        frequency: 60,
        gain: 0,
        range: 54,
      },
      sources: [],
      guides: [],
      globals: {
        $c: { min: 300, max: 400, value: 343 },
      },
      variables: {},
    };

    this.save(project);
    return safeDeepClone(project);
  }

  private readStorage(): Project[] {
    const projects: RawProject[] = migrate(JSON.parse(localStorage.getItem('projects') ?? '[]'));
    return projects
      .concat(examples.map((project: any): RawProject => ({ ...project, example: true })))
      .map((project) => this.hydrateInfo(project));
  }

  private writeStorage(): void {
    const projects = [...this.projects.values()].filter((p) => !p.example);
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  private hydrateInfo({ created, lastModified, ...project }: RawProject): Project {
    return {
      ...project,
      created: new Date(created),
      lastModified: new Date(lastModified),
    };
  }

  private hydrateData(project: Project): Project {
    for (const source of project.sources) {
      for (const expr of [source.x, source.y, source.angle, source.width, source.depth, source.delay, source.gain]) {
        this.hydrateExpr(expr);
      }
    }

    for (const guide of project.guides) {
      this.hydrateExpr(guide.x);
      this.hydrateExpr(guide.y);
      this.hydrateExpr(guide.angle);

      if (guide.kind === 'rect') {
        this.hydrateExpr(guide.width);
        this.hydrateExpr(guide.height);
      } else {
        this.hydrateExpr(guide.absorption);
      }
    }

    return project;
  }

  private hydrateExpr(expr: ExpressionProperty): void {
    try {
      expr[$expr] = this.parser.parse(expr.source);
      expr[$vars] = extractVariables(expr[$expr]);
    } catch (e) {
      expr.error = e.message;
    }
  }
}
