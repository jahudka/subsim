import { Guide, SimulationOptions, Source, ViewState } from '../state';

export interface EngineInterface {
  setCanvas(type: 'plot' | 'ui' | 'context' | 'legend', canvas: HTMLCanvasElement | OffscreenCanvas): void;
  setCanvasSize(type: 'plot' | 'context' | 'legend', width: number, height: number): void;
  setView(view: ViewState): void;
  setOptions(options: SimulationOptions, $c: number): void;
  mergeSource(source: Source): void;
  deleteSource(id: string): void;
  mergeGuide(guide: Guide): void;
  deleteGuide(id: string): void;
  clearAll(): void;
  render(): void;
  renderContext(x: number, y: number): void;
  exportOnto(ctx: CanvasRenderingContext2D, ui?: boolean, legend?: boolean): void;
  on(event: 'plot-rendered', handler: (resolution: number) => void): void;
  on(event: 'context-rendered', handler: () => void): void;
  once(event: 'plot-rendered', handler: (resolution: number) => void): void;
  once(event: 'context-rendered', handler: () => void): void;
  off(event?: 'plot-rendered', handler?: (resolution: number) => void): void;
  off(event?: 'context-rendered', handler?: () => void): void;
}
