import { Guide, Source } from '../state';
import { safeDeepClone } from '../utils';
import { Engine } from './engine';
import { Exporter } from './exporter';

export class LocalEngine extends Engine {
  private readonly exporter: Exporter = new Exporter();

  setCanvas(type: 'plot' | 'ui' | 'context' | 'legend', canvas: HTMLCanvasElement) {
    this.exporter.setCanvas(type, canvas);
    super.setCanvas(type, canvas);
  }

  mergeSource(source: Source) {
    super.mergeSource(safeDeepClone(source));
  }

  mergeGuide(guide: Guide) {
    super.mergeGuide(safeDeepClone(guide));
  }

  exportOnto(ctx: CanvasRenderingContext2D, ui?: boolean, legend?: boolean): void {
    this.exporter.exportImageOnto(ctx, ui, legend);
  }
}
