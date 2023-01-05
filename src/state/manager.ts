import { extractVariables, Parser } from '../expressions';
import { $expr, $id, $vars, ExpressionProperty, Project } from './types';
import examples from './examples.json';

export class ProjectManager {
  private readonly parser: Parser;
  private readonly projects: Map<string, Project>;
  private list?: Project[];
  private gid: number = -1;

  constructor(parser: Parser) {
    this.parser = parser;
    this.projects = new Map(
      this.readStorage()
        .map((project) => [project.name, this.hydrate(project)] as const)
        .sort(([, a], [, b]) => b.lastModified.getTime() - a.lastModified.getTime())
    );
  }

  getList(): Project[] {
    return this.list ??= [...this.projects.values()];
  }

  loadLast(): Project {
    for (const project of this.projects.values()) {
      return project;
    }

    return this.create();
  }

  load(name: string): Project {
    return this.projects.get(name)!;
  }

  save(project: Project): void {
    this.projects.set(project.name, project);
    this.writeStorage();
  }

  delete(name: string): void {
    this.projects.delete(name);
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
      name: this.getNewProjectName(),
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
    return { ...project };
  }

  private getNewProjectName(): string {
    if (!this.projects.has('new project')) {
      return 'new project';
    }

    for (let i = 2; ; ++i) {
      const name = `new project ${i}`;

      if (!this.projects.has(name)) {
        return name;
      }
    }
  }

  private readStorage(): Project[] {
    return JSON.parse(localStorage.getItem('projects') ?? 'null') || examples;
  }

  private writeStorage(): void {
    localStorage.setItem('projects', JSON.stringify([...this.projects.values()]));
    this.list = undefined;
  }

  private hydrate(project: Project): Project {
    project[$id] = this.nextId();
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
