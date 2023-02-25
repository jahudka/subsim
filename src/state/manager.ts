import { extractVariables, Parser } from '../expressions';
import { $expr, $id, $vars } from '../utils';
import { migrate } from './migrations';
import { ExpressionProperty, Project } from './types';
import examples from './examples.json';
import { randomString, safeDeepClone } from './utils';

export class ProjectManager {
  private readonly parser: Parser;
  private readonly projects: Map<string, Project>;
  private list?: Project[];
  private gid: number = -1;

  constructor(parser: Parser) {
    this.parser = parser;
    this.projects = new Map(this.readStorage().map((project) => [project.id, this.hydrate(project)]));
  }

  getName(id: string): string {
    return this.projects.get(id)!.name;
  }

  getList(): Project[] {
    return this.list ??= [...this.projects.values()].sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }

  loadLast(): Project {
    for (const project of this.getList()) {
      return safeDeepClone(project);
    }

    return this.create();
  }

  load(id: string): Project {
    return safeDeepClone(this.projects.get(id)!);
  }

  save(project: Project): void {
    this.projects.set(project.id, project);
    this.writeStorage();
  }

  delete(id: string): void {
    this.projects.delete(id);
    this.writeStorage();
  }

  nextId(): number {
    if (++this.gid >= Number.MAX_SAFE_INTEGER) {
      this.gid = 0;
    }

    return this.gid;
  }

  create(): Project {
    const created = new Date();
    const project: Project = {
      id: this.getNewProjectId(),
      name: 'new project',
      created,
      lastModified: created,
      area: {
        width: 140,
        depth: 100,
        x0: 70,
        y0: 25,
        scale: 6,
        orientation: 'portrait',
      },
      simulation: {
        frequency: 60,
        resolution: 4,
        gain: 0,
      },
      sources: [],
      guides: [],
      globals: {
        $c: {
          min: 300,
          max: 400,
          value: 343,
        },
      },
      variables: {},
    };

    this.save(project);
    return safeDeepClone(project);
  }

  private getNewProjectId(): string {
    while (true) {
      const id = randomString();

      if (!this.projects.has(id)) {
        return id;
      }
    }
  }

  private readStorage(): Project[] {
    const projects: Project[] = migrate(JSON.parse(localStorage.getItem('projects') ?? '[]'));
    return projects.concat(examples as any);
  }

  private writeStorage(): void {
    const projects = [...this.projects.values()].filter((p) => !/^examples\//.test(p.id));
    localStorage.setItem('projects', JSON.stringify(projects));
    this.list = undefined;
  }

  private hydrate(project: Project): Project {
    project.created = new Date(project.created);
    project.lastModified = new Date(project.lastModified);

    for (const source of project.sources) {
      source[$id] = this.nextId();

      for (const expr of [source.x, source.y, source.angle, source.width, source.depth, source.delay, source.gain]) {
        this.hydrateExpr(expr);
      }
    }

    for (const guide of project.guides) {
      guide[$id] = this.nextId();
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
