import { Line, Source, SourceModel } from '../state';
import { dbToGain, distance, gainToDb, rad } from '../utils';

export type Arrival = {
  gain: number;
  delay: number;
};

const models: Record<string, SourceModel> = {
  omni: () => 1,
  cardioid: (a) => (1 - Math.cos(a - Math.PI / 2)) / 2,
};

export class ArrivalMap {
  private readonly sources: Map<string, Source> = new Map();
  private readonly walls: Map<string, Line> = new Map();
  private readonly reflections: Map<string, Map<string, Source>> = new Map();
  private readonly arrivals: Map<string, Map<number, Map<number, Arrival>>> = new Map();
  private readonly active: Set<Source> = new Set();
  private $c: number = 343;

  mergeSource(source: Source): void {
    const existing = this.sources.get(source.id);

    if (existing) {
      if (
        existing.x.value === source.x.value
        && existing.y.value === source.y.value
        && existing.angle.value === source.angle.value
        && existing.model === source.model
      ) {
        this.mergeSourceIntoExisting(source, existing);
        return;
      } else {
        this.deleteSource(existing);
      }
    }

    this.sources.set(source.id, source);
    this.active.add(source);
    this.resolveSourceReflections(source);
  }

  deleteSource(id: Source | string): void {
    const source = typeof id === 'string' ? this.sources.get(id) : id;

    if (!source) {
      return;
    }

    this.sources.delete(source.id);
    this.arrivals.delete(source.id);
    this.active.delete(source);

    for (const reflection of this.reflections.get(source.id)?.values() ?? []) {
      this.arrivals.delete(reflection.id);
      this.active.delete(reflection);
    }

    this.reflections.delete(source.id);
  }

  mergeWall(wall: Line): void {
    const existing = this.walls.get(wall.id);

    if (existing) {
      if (
        existing.x.value === wall.x.value
        && existing.y.value === wall.y.value
        && existing.angle.value === wall.angle.value
      ) {
        this.toggleWallEnabled(existing, wall.reflect);
        return;
      } else {
        this.deleteWall(existing);
      }
    }

    this.walls.set(wall.id, wall);
    this.resolveWallReflections(wall);
  }

  deleteWall(id: Line | string): void {
    const wall = typeof id === 'string' ? this.walls.get(id) : id;

    if (!wall) {
      return;
    }

    this.walls.delete(wall.id);

    for (const reflections of this.reflections.values()) {
      const reflection = reflections.get(wall.id);

      if (reflection) {
        this.arrivals.delete(reflection.id);
        this.active.delete(reflection);
        reflections.delete(wall.id);
      }
    }
  }

  setSpeedOfSound($c: number): void {
    if ($c !== this.$c) {
      this.$c = $c;
      this.clear();
    }
  }

  get(x: number, y: number): [Source, Arrival][] {
    return [...this.active].map((source) => {
      this.arrivals.has(source.id) || this.arrivals.set(source.id, new Map());
      const ymap = this.arrivals.get(source.id)!;
      ymap.has(y) || ymap.set(y, new Map());
      const xmap = ymap.get(y)!;

      if (!xmap.has(x)) {
        const dist = distance(x, y, source.x.value, source.y.value);
        const angle = Math.atan2(source.x.value - y, source.y.value - x) + rad(source.angle.value);
        const gain = models[source.model](angle) / Math.max(0.1, dist);

        xmap.set(x, {
          gain,
          delay: dist / this.$c,
        });
      }

      return [source, xmap.get(x)!];
    });
  }

  isEmpty(): boolean {
    return !this.active.size;
  }

  clear(): void {
    this.arrivals.clear();
  }

  clearAll(): void {
    this.sources.clear();
    this.walls.clear();
    this.reflections.clear();
    this.arrivals.clear();
    this.active.clear();
  }

  private mergeSourceIntoExisting(source: Source, existing: Source): void {
    this.mergeSourceProps(source, existing);

    for (const reflection of this.reflections.get(source.id)?.values() ?? []) {
      this.mergeSourceProps(source, reflection);
    }
  }

  private mergeSourceProps(source: Source, existing: Source): void {
    existing.width = source.width;
    existing.depth = source.depth;
    existing.gain = source.gain;
    existing.delay = source.delay;
    existing.invert = source.invert;
    existing.enabled = source.enabled;
    existing.enabled ? this.active.add(existing) : this.active.delete(existing);
  }

  private toggleWallEnabled(wall: Line, enabled: boolean): void {
    wall.reflect = enabled;

    for (const reflections of this.reflections.values()) {
      const reflection = reflections.get(wall.id);

      if (reflection) {
        enabled ? this.active.add(reflection) : this.active.delete(reflection);
        reflection.enabled = enabled;
      }
    }
  }

  private resolveSourceReflections(source: Source): void {
    const reflections: Map<string, Source> = new Map();

    for (const wall of this.walls.values()) {
      reflections.set(wall.id, this.reflect(source, wall));
    }

    this.reflections.set(source.id, reflections);
  }

  private resolveWallReflections(wall: Line): void {
    for (const [srcId, reflections] of this.reflections) {
      const source = this.sources.get(srcId)!;
      reflections.set(wall.id, this.reflect(source, wall));
    }
  }

  private reflect(source: Source, wall: Line): Source {
    const angle = -rad(wall.angle.value);
    const a = Math.sin(angle);
    const b = Math.cos(angle);
    const c = -wall.y.value * a - wall.x.value * b;
    const p = source.x.value;
    const q = source.y.value;
    const a2 = a ** 2;
    const b2 = b ** 2;
    const x = (p * (a2 - b2) - 2 * b * (a * q + c)) / (a2 + b2);
    const y = (q * (b2 - a2) - 2 * a * (b * p + c)) / (a2 + b2);
    const absorption = wall.absorption.value >= 0 ? Math.sqrt(1 - wall.absorption.value) : dbToGain(wall.absorption.value);
    const gain = dbToGain(source.gain.value);
    const reflection: Source = {
      ...source,
      id: `${source.id}@${wall.id}`,
      x: { value: x, source: '' },
      y: { value: y, source: '' },
      angle: { value: -source.angle.value + 2 * wall.angle.value, source: '' },
      gain: { value: gainToDb(gain * absorption), source: '' },
    };

    wall.reflect && source.enabled && this.active.add(reflection);
    return reflection;
  }
}
